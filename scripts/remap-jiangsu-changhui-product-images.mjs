import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  TENANT_ID,
  categoryImageMappingBySlug,
  categoryImageMappings,
  productImageMappingBySlug,
  productImageMappings,
} from '../lib/product-image-remap.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSnapshotPath = resolve(repositoryRoot, 'output/private/image-remap-rollback.json')

function assertTenantRow(row) {
  if (row?.tenant_id !== TENANT_ID) {
    throw new Error(`Refusing row outside Jiangsu Changhui tenant ${TENANT_ID}`)
  }
}

export function buildProductPatch(row) {
  assertTenantRow(row)
  const mapping = productImageMappingBySlug[row.slug]
  if (!mapping) throw new Error(`No approved product image mapping for ${row.slug}`)

  return {
    image_url: mapping.imageUrl,
    extra_data: {
      ...(row.extra_data && typeof row.extra_data === 'object' && !Array.isArray(row.extra_data) ? row.extra_data : {}),
      images: mapping.images,
      imageAlt: mapping.imageAlt,
      imageContext: mapping.imageContext,
    },
  }
}

export function buildCategoryPatch(row) {
  assertTenantRow(row)
  const mapping = categoryImageMappingBySlug[row.slug]
  if (!mapping) throw new Error(`No approved category image mapping for ${row.slug}`)

  return {
    extra_data: {
      ...(row.extra_data && typeof row.extra_data === 'object' && !Array.isArray(row.extra_data) ? row.extra_data : {}),
      image_url: mapping.imageUrl,
      imageAlt: mapping.imageAlt,
      imageContext: mapping.imageContext,
    },
  }
}

function parseArguments(args) {
  const apply = args.includes('--apply')
  const explicitDryRun = args.includes('--dry-run')
  if (apply && explicitDryRun) throw new Error('Choose either --dry-run or --apply, not both')

  const snapshotIndex = args.indexOf('--snapshot')
  const snapshotPath = snapshotIndex >= 0 ? resolve(args[snapshotIndex + 1] || '') : defaultSnapshotPath
  if (snapshotIndex >= 0 && !args[snapshotIndex + 1]) throw new Error('--snapshot requires a file path')
  return { apply, snapshotPath }
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  if (process.env.NEXT_PUBLIC_TENANT_ID && process.env.NEXT_PUBLIC_TENANT_ID !== TENANT_ID) {
    throw new Error(`NEXT_PUBLIC_TENANT_ID does not match the locked tenant ${TENANT_ID}`)
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function readRows(client) {
  const productSlugs = productImageMappings.map(({ slug }) => slug)
  const categorySlugs = categoryImageMappings.map(({ slug }) => slug)
  const [productsResult, categoriesResult] = await Promise.all([
    client
      .from('products')
      .select('id,tenant_id,slug,image_url,extra_data,updated_at,is_active')
      .eq('tenant_id', TENANT_ID)
      .in('slug', productSlugs)
      .order('slug'),
    client
      .from('product_categories')
      .select('id,tenant_id,slug,extra_data,updated_at,is_active')
      .eq('tenant_id', TENANT_ID)
      .in('slug', categorySlugs)
      .order('slug'),
  ])
  if (productsResult.error) throw productsResult.error
  if (categoriesResult.error) throw categoriesResult.error

  const products = productsResult.data ?? []
  const categories = categoriesResult.data ?? []
  if (products.length !== 27 || categories.length !== 6) {
    throw new Error(`Expected 27 product and 6 category rows, received ${products.length} and ${categories.length}`)
  }
  for (const row of [...products, ...categories]) assertTenantRow(row)
  return { products, categories }
}

export async function writeSnapshot(snapshotPath, rows) {
  await mkdir(dirname(snapshotPath), { recursive: true })
  try {
    await writeFile(snapshotPath, `${JSON.stringify({ tenantId: TENANT_ID, capturedAt: new Date().toISOString(), ...rows }, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    })
    return true
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'EEXIST') return false
    throw error
  }
}

async function verifyR2Assets() {
  const urls = [...new Set([
    ...productImageMappings.flatMap(({ images }) => images),
    ...categoryImageMappings.map(({ imageUrl }) => imageUrl),
  ])]
  const results = await Promise.all(urls.map(async (url) => {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    if (response.status !== 200 || !response.headers.get('content-type')?.startsWith('image/')) {
      throw new Error(`R2 HEAD validation failed for ${url}: ${response.status} ${response.headers.get('content-type') || 'unknown type'}`)
    }
    return response.status
  }))
  return { checked: results.length, ok: results.filter((status) => status === 200).length }
}

function patchMatches(row, patch) {
  if ('image_url' in patch && row.image_url !== patch.image_url) return false
  return JSON.stringify(row.extra_data ?? {}) === JSON.stringify(patch.extra_data)
}

export function summarizePlan() {
  return {
    products: productImageMappings.length,
    categories: categoryImageMappings.length,
    distinctProductUrls: new Set(productImageMappings.map(({ imageUrl }) => imageUrl)).size,
    distinctCategoryUrls: new Set(categoryImageMappings.map(({ imageUrl }) => imageUrl)).size,
  }
}

async function updateProduct(client, row) {
  const patch = buildProductPatch(row)
  if (patchMatches(row, patch)) return false
  const result = await client
    .from('products')
    .update(patch)
    .eq('tenant_id', TENANT_ID)
    .eq('id', row.id)
    .eq('slug', row.slug)
    .select('id')
  if (result.error) throw result.error
  if (result.data?.length !== 1) throw new Error(`Expected one updated product row for ${row.slug}`)
  return true
}

async function updateCategory(client, row) {
  const patch = buildCategoryPatch(row)
  if (patchMatches(row, patch)) return false
  const result = await client
    .from('product_categories')
    .update(patch)
    .eq('tenant_id', TENANT_ID)
    .eq('id', row.id)
    .eq('slug', row.slug)
    .select('id')
  if (result.error) throw result.error
  if (result.data?.length !== 1) throw new Error(`Expected one updated category row for ${row.slug}`)
  return true
}

function verifyAppliedRows(rows) {
  const distinctProductUrls = new Set()
  const distinctCategoryUrls = new Set()

  for (const row of rows.products) {
    const patch = buildProductPatch(row)
    if (!patchMatches(row, patch)) throw new Error(`Product readback mismatch for ${row.slug}`)
    if (row.image_url !== row.extra_data?.images?.[0]) throw new Error(`Product cover/gallery mismatch for ${row.slug}`)
    distinctProductUrls.add(row.image_url)
  }
  for (const row of rows.categories) {
    const patch = buildCategoryPatch(row)
    if (!patchMatches(row, patch)) throw new Error(`Category readback mismatch for ${row.slug}`)
    distinctCategoryUrls.add(row.extra_data?.image_url)
  }
  if (distinctProductUrls.size < 15) throw new Error(`Expected at least 15 distinct product covers, found ${distinctProductUrls.size}`)
  if (distinctCategoryUrls.size !== 6) throw new Error(`Expected six distinct category covers, found ${distinctCategoryUrls.size}`)
  return { products: rows.products.length, categories: rows.categories.length, distinctProductUrls: distinctProductUrls.size, distinctCategoryUrls: distinctCategoryUrls.size }
}

export async function run(args = process.argv.slice(2)) {
  const { apply, snapshotPath } = parseArguments(args)
  const client = createAdminClient()
  const before = await readRows(client)
  await writeSnapshot(snapshotPath, before)
  const r2 = await verifyR2Assets()

  if (!apply) {
    const plan = summarizePlan()
    return {
      mode: 'dry-run',
      tenantId: TENANT_ID,
      snapshotPath,
      rows: { products: before.products.length, categories: before.categories.length },
      plannedDistinctProductUrls: plan.distinctProductUrls,
      plannedDistinctCategoryUrls: plan.distinctCategoryUrls,
      r2,
    }
  }

  let updatedProducts = 0
  let updatedCategories = 0
  for (const row of before.products) updatedProducts += Number(await updateProduct(client, row))
  for (const row of before.categories) updatedCategories += Number(await updateCategory(client, row))

  const after = await readRows(client)
  const verified = verifyAppliedRows(after)
  return { mode: 'apply', tenantId: TENANT_ID, snapshotPath, updatedProducts, updatedCategories, verified, r2 }
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectExecution) {
  run()
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .catch((error) => {
      console.error(`[jiangsu-changhui-image-remap] ${error instanceof Error ? error.message : String(error)}`)
      process.exitCode = 1
    })
}

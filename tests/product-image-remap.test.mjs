import assert from 'node:assert/strict'
import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tenantId = '0f4f3ffa-9a1b-468f-8408-2f59a3b64e45'
const requiredReferenceContext = 'Manufacturing reference — customer-supplied photo, not model-specific'
const switchgearLabelledFiles = [
  '31da433f19c652ef226adf68587f0afd.jpg',
  'bfb6243b6e876212a40c6c1f97cd18d2.jpg',
  'd9fdc25dc385d622514d29fad41d86dc.jpg',
  '9f207edbf52231ba32365ec49be9a90d.jpg',
  'fcabfea35ff10fbd7d0106d729a26390.jpg',
  '72df68df4bc1cfa526bb3ae4da3d4f06.jpg',
  '74555b5dbc17d0e1f4dbd000e97d0cda.jpg',
]

async function loadRemap() {
  const absolutePath = resolve(repositoryRoot, 'lib/product-image-remap.mjs')
  try {
    await access(absolutePath)
  } catch {
    assert.fail('lib/product-image-remap.mjs must define the customer-only remap')
  }
  return import(`${pathToFileURL(absolutePath).href}?test=${Date.now()}`)
}

async function loadRemapScript() {
  const absolutePath = resolve(repositoryRoot, 'scripts/remap-jiangsu-changhui-product-images.mjs')
  try {
    await access(absolutePath)
  } catch {
    assert.fail('the idempotent customer-specific remap script must exist')
  }
  return import(`${pathToFileURL(absolutePath).href}?test=${Date.now()}`)
}

test('the customer-only remap covers exactly 27 products and six categories', async () => {
  const { TENANT_ID, productImageMappings, categoryImageMappings } = await loadRemap()

  assert.equal(TENANT_ID, tenantId)
  assert.equal(productImageMappings.length, 27)
  assert.equal(categoryImageMappings.length, 6)
  assert.equal(new Set(productImageMappings.map(({ slug }) => slug)).size, 27)
  assert.equal(new Set(categoryImageMappings.map(({ slug }) => slug)).size, 6)
  assert.ok(productImageMappings.every(({ tenantId: rowTenantId }) => rowTenantId === tenantId))
  assert.ok(categoryImageMappings.every(({ tenantId: rowTenantId }) => rowTenantId === tenantId))
})

test('product mappings are varied, internally consistent, and truthfully contextualised', async () => {
  const { productImageMappings } = await loadRemap()

  assert.ok(new Set(productImageMappings.map(({ imageUrl }) => imageUrl)).size >= 15)
  for (const mapping of productImageMappings) {
    assert.equal(mapping.imageUrl, mapping.images[0], `${mapping.slug} must use its first gallery image as cover`)
    assert.ok(mapping.imageAlt.length > 20, `${mapping.slug} needs truthful alt text`)
    assert.ok(mapping.imageContext.length > 20, `${mapping.slug} needs visible image context`)
    if (mapping.slug !== 'kyn28-12') {
      assert.match(mapping.imageContext, new RegExp(requiredReferenceContext, 'i'))
    }
  }

  const byCategory = Map.groupBy(productImageMappings, ({ category }) => category)
  for (const [category, mappings] of byCategory) {
    if (mappings.length > 1) {
      assert.ok(new Set(mappings.map(({ imageUrl }) => imageUrl)).size > 1, `${category} must not repeat one cover for every product`)
    }
  }
})

test('switchgear-labelled photographs never appear outside high-voltage products', async () => {
  const { productImageMappings } = await loadRemap()

  for (const mapping of productImageMappings) {
    const labelledImages = mapping.images.filter((url) => switchgearLabelledFiles.some((file) => url.endsWith(file)))
    if (mapping.category !== 'hv-switchgear') assert.deepEqual(labelledImages, [], mapping.slug)
    if (mapping.category === 'cable-tray') assert.deepEqual(labelledImages, [], mapping.slug)
  }

  const kyn28 = productImageMappings.find(({ slug }) => slug === 'kyn28-12')
  assert.deepEqual(
    kyn28.images.map((url) => url.split('/').at(-1)),
    switchgearLabelledFiles.slice(0, 3),
  )
  assert.match(kyn28.imageAlt, /visible KYN28A-12 series variant/i)
  assert.match(kyn28.imageContext, /visible KYN28A-12 series variant/i)

  for (const slug of ['kyn61-40-5', 'hxgn-12']) {
    const mapping = productImageMappings.find((entry) => entry.slug === slug)
    assert.match(mapping.imageContext, /high-voltage project\/manufacturing reference/i)
    assert.match(mapping.imageContext, /not the exact listed model/i)
  }
})

test('all manufacturing-only photographs are used and category covers remain conservative', async () => {
  const { manufacturingOnlyFiles, productImageMappings, categoryImageMappings } = await loadRemap()
  const usedFiles = new Set(productImageMappings.flatMap(({ images }) => images.map((url) => url.split('/').at(-1))))

  assert.equal(manufacturingOnlyFiles.length, 15)
  assert.ok(manufacturingOnlyFiles.every((file) => usedFiles.has(file)), 'all 15 manufacturing references should contribute variety')
  assert.equal(new Set(categoryImageMappings.map(({ imageUrl }) => imageUrl)).size, 6)
  assert.ok(categoryImageMappings.every(({ imageContext }) => imageContext.includes(requiredReferenceContext)))
  assert.ok(categoryImageMappings.every(({ imageAlt }) => /reference/i.test(imageAlt) && /not model-specific/i.test(imageAlt)))
})

test('list and detail UIs expose the image reference caption', async () => {
  const files = [
    'app/products/products-page-client.tsx',
    'app/products/[categorySlug]/page.tsx',
    'app/products/[categorySlug]/[productSlug]/product-detail-client.tsx',
  ]
  const source = (await Promise.all(files.map((file) => readFile(resolve(repositoryRoot, file), 'utf8')))).join('\n')

  assert.match(source, /imageContext/)
  assert.match(source, /Manufacturing reference/)
  assert.doesNotMatch(source, /alt=\{(?:product|item)\.name\}/)
  assert.doesNotMatch(source, /Neutral category illustration for/)
})

test('the remap script builds tenant-locked, idempotent patches without losing extra data', async () => {
  const { buildCategoryPatch, buildProductPatch, summarizePlan } = await loadRemapScript()
  const productRow = {
    tenant_id: tenantId,
    slug: 'mns',
    image_url: 'https://old.invalid/cover.jpg',
    extra_data: { retained: 'yes', images: ['https://old.invalid/cover.jpg'] },
  }
  const productPatch = buildProductPatch(productRow)

  assert.equal(productPatch.image_url, productPatch.extra_data.images[0])
  assert.equal(productPatch.extra_data.retained, 'yes')
  assert.match(productPatch.extra_data.imageContext, new RegExp(requiredReferenceContext, 'i'))

  const categoryPatch = buildCategoryPatch({
    tenant_id: tenantId,
    slug: 'cable-tray',
    extra_data: { retained: 'yes' },
  })
  assert.equal(categoryPatch.extra_data.retained, 'yes')
  assert.match(categoryPatch.extra_data.imageContext, new RegExp(requiredReferenceContext, 'i'))

  assert.throws(
    () => buildProductPatch({ ...productRow, tenant_id: '00000000-0000-0000-0000-000000000000' }),
    /refusing row outside Jiangsu Changhui tenant/i,
  )

  assert.deepEqual(summarizePlan(), {
    products: 27,
    categories: 6,
    distinctProductUrls: 18,
    distinctCategoryUrls: 6,
  })
})

test('the rollback snapshot preserves the first pre-apply state', async (t) => {
  const { writeSnapshot } = await loadRemapScript()
  const directory = await mkdtemp(resolve(tmpdir(), 'changhui-remap-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const snapshotPath = resolve(directory, 'rollback.json')
  const first = { products: [{ slug: 'before' }], categories: [] }
  const second = { products: [{ slug: 'after' }], categories: [] }

  await writeSnapshot(snapshotPath, first)
  await writeSnapshot(snapshotPath, second)

  const saved = JSON.parse(await readFile(snapshotPath, 'utf8'))
  assert.equal(saved.products[0].slug, 'before')
})

import assert from 'node:assert/strict'
import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tenantId = '0f4f3ffa-9a1b-468f-8408-2f59a3b64e45'
const refreshPrefix = '/customer-product-refresh-2026-08/'

async function loadRemap() {
  const path = resolve(repositoryRoot, 'lib/product-image-remap.mjs')
  await access(path)
  return import(`${pathToFileURL(path).href}?test=${Date.now()}`)
}

async function loadRemapScript() {
  const path = resolve(repositoryRoot, 'scripts/remap-jiangsu-changhui-product-images.mjs')
  await access(path)
  return import(`${pathToFileURL(path).href}?test=${Date.now()}`)
}

test('the customer-only remap covers exactly 27 products and six categories', async () => {
  const { TENANT_ID, productImageMappings, categoryImageMappings } = await loadRemap()
  assert.equal(TENANT_ID, tenantId)
  assert.equal(productImageMappings.length, 27)
  assert.equal(categoryImageMappings.length, 6)
  assert.equal(new Set(productImageMappings.map(({ slug }) => slug)).size, 27)
  assert.equal(new Set(categoryImageMappings.map(({ slug }) => slug)).size, 6)
  assert.ok([...productImageMappings, ...categoryImageMappings].every(({ tenantId: id }) => id === tenantId))
})

test('all product and category mappings use only the reviewed customer refresh prefix', async () => {
  const { productImageMappings, categoryImageMappings } = await loadRemap()
  const urls = [
    ...productImageMappings.flatMap(({ images }) => images),
    ...categoryImageMappings.map(({ imageUrl }) => imageUrl),
  ]
  assert.ok(urls.every((url) => url.startsWith('https://') && url.includes(refreshPrefix) && url.endsWith('.webp')))
  assert.ok(productImageMappings.every(({ imageUrl, images }) => imageUrl === images[0]))
  assert.ok(productImageMappings.every(({ imageAlt, imageContext }) => imageAlt.length > 20 && imageContext.length > 20))
})

test('all 32 approved customer product sources are used and third-party-branded source is absent', async () => {
  const { productImageMappings } = await loadRemap()
  const used = new Set(productImageMappings.flatMap(({ sourceIds }) => sourceIds))
  assert.equal(used.size, 32)
  assert.ok(!used.has('busway-tap-box-open'))
  for (const sourceId of used) assert.doesNotMatch(sourceId, /advertising|industry|unclear-origin/)
})

test('unverified exact models are explicitly presented as related family references', async () => {
  const { productImageMappingBySlug } = await loadRemap()
  for (const slug of ['svc', 'ats-dual-source', 'jp-integrated', 'dbx-smc', 'box-substation', 'dnch-fx', 'gqqj-high-strength']) {
    assert.match(productImageMappingBySlug[slug].imageContext, /not the exact listed model/i)
    assert.match(productImageMappingBySlug[slug].imageAlt, /not the exact listed model/i)
  }
})

test('the remap script builds tenant-locked, idempotent patches without losing extra data', async () => {
  const { buildCategoryPatch, buildProductPatch, summarizePlan } = await loadRemapScript()
  const row = { tenant_id: tenantId, slug: 'mns', image_url: 'https://old.invalid/cover.jpg', extra_data: { retained: 'yes' } }
  const productPatch = buildProductPatch(row)
  assert.equal(productPatch.image_url, productPatch.extra_data.images[0])
  assert.equal(productPatch.extra_data.retained, 'yes')
  assert.match(productPatch.image_url, new RegExp(refreshPrefix))
  const categoryPatch = buildCategoryPatch({ tenant_id: tenantId, slug: 'cable-tray', extra_data: { retained: 'yes' } })
  assert.equal(categoryPatch.extra_data.retained, 'yes')
  assert.match(categoryPatch.extra_data.image_url, new RegExp(refreshPrefix))
  assert.throws(() => buildProductPatch({ ...row, tenant_id: '00000000-0000-0000-0000-000000000000' }), /refusing row outside/i)
  assert.deepEqual(summarizePlan(), { products: 27, categories: 6, distinctProductUrls: 25, distinctCategoryUrls: 6 })
})

test('the rollback snapshot preserves the first pre-apply state', async (t) => {
  const { writeSnapshot } = await loadRemapScript()
  const directory = await mkdtemp(resolve(tmpdir(), 'changhui-remap-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const snapshotPath = resolve(directory, 'rollback.json')
  await writeSnapshot(snapshotPath, { products: [{ slug: 'before' }], categories: [] })
  await writeSnapshot(snapshotPath, { products: [{ slug: 'after' }], categories: [] })
  const saved = JSON.parse(await readFile(snapshotPath, 'utf8'))
  assert.equal(saved.products[0].slug, 'before')
})

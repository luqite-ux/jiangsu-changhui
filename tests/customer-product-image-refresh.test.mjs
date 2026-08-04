import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import test from 'node:test'

const manifestUrl = new URL('../lib/customer-product-image-refresh.mjs', import.meta.url)
const inventoryUrl = new URL('../scripts/inventory-jiangsu-changhui-customer-images.mjs', import.meta.url)

async function loadManifest() {
  return import(`${manifestUrl.href}?test=${Date.now()}`)
}

test('the customer archive manifest accounts for all 52 supplied images exactly once', async () => {
  const { SOURCE_ARCHIVE_FILE_COUNT, sourceImageManifest } = await loadManifest()
  const paths = sourceImageManifest.map(({ archivePath }) => archivePath)
  const ids = sourceImageManifest.map(({ sourceId }) => sourceId)

  assert.equal(SOURCE_ARCHIVE_FILE_COUNT, 52)
  assert.equal(sourceImageManifest.length, 52)
  assert.equal(new Set(paths).size, 52)
  assert.equal(new Set(ids).size, 52)

  for (const entry of sourceImageManifest) {
    for (const field of ['sourceId', 'archivePath', 'kind', 'decision', 'reason', 'target', 'restorationProfile']) {
      assert.ok(field in entry, `${entry.sourceId || entry.archivePath} must define ${field}`)
    }
  }
})

test('source decisions enforce the approved authenticity-first scope', async () => {
  const {
    approvedIndustrySources,
    approvedProductSources,
    conditionalAdSources,
    rejectedSources,
    sourceById,
  } = await loadManifest()

  assert.equal(approvedProductSources.length, 33)
  assert.equal(approvedIndustrySources.length, 5)
  assert.equal(conditionalAdSources.length, 2)
  assert.equal(rejectedSources.length, 12)
  assert.ok(rejectedSources.every(({ archivePath, reason }) =>
    archivePath.startsWith('网站图片/其他图片/') && reason === 'unclear-origin'))

  assert.deepEqual(
    approvedIndustrySources.map(({ sourceId }) => sourceId).sort(),
    ['industry-grid', 'industry-high-speed-rail', 'industry-mixed-use', 'industry-solar', 'industry-wind'].sort(),
  )

  for (const source of [...approvedProductSources, ...approvedIndustrySources, ...conditionalAdSources]) {
    assert.ok(source.target.category || source.target.placement, `${source.sourceId} needs a category or placement`)
  }

  for (const unsupportedExactModel of ['svc', 'ats-dual-source', 'jp-integrated', 'dbx-smc', 'box-substation']) {
    assert.ok(
      !approvedProductSources.some(({ target }) => target.exactProductSlug === unsupportedExactModel),
      `${unsupportedExactModel} has no verified exact source image`,
    )
  }

  assert.equal(Object.keys(sourceById).length, 52)
})

test('the inventory script rejects unsafe or incomplete archive entry lists', async () => {
  await access(inventoryUrl)
  const { validateArchiveEntryPaths } = await import(`${inventoryUrl.href}?test=${Date.now()}`)
  const { sourceImageManifest } = await loadManifest()
  const expected = sourceImageManifest.map(({ archivePath }) => archivePath)

  assert.deepEqual(validateArchiveEntryPaths(expected), expected)
  assert.throws(() => validateArchiveEntryPaths([...expected, '../escape.jpg']), /unsafe archive path/i)
  assert.throws(() => validateArchiveEntryPaths(expected.slice(1)), /archive entries do not match manifest/i)
})

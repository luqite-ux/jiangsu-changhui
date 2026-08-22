import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import test from 'node:test'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8')
const footerSource = read("components/site-footer.tsx")
const ownerEvidence = read("lib/site-data.ts")
const exactCompanyName = "Jiangsu Changhui Electric Co., Ltd."

test('footer renders the verified legal owner with a runtime year and one terminal period', () => {
  assert.ok(
    (footerSource + '\n' + ownerEvidence).includes(exactCompanyName),
    'missing verified legal owner: ' + exactCompanyName,
  )
  assert.match(footerSource, /new Date\(\)\.getFullYear\(\)/)
  assert.ok(
    footerSource.includes(".replace(/[.\\s]+$/, '')") ||
      footerSource.includes('.replace(/[.\\s]+$/, "")'),
    'company terminal punctuation must be normalized before rendering',
  )
  assert.match(footerSource, /\{footerCompanyName\}\. All rights reserved\./)
  assert.doesNotMatch(footerSource, /\{footerCompanyName\}\.\./)

  const copyrightSource = footerSource
    .split(/\r?\n/)
    .filter((line) => /©|&copy;|copyright/i.test(line))
    .join('\n')
  assert.doesNotMatch(copyrightSource, /[\u3400-\u9fff]/u)
  assert.equal(copyrightSource.includes("Jiangsu Changhui Electric. All rights reserved."), false)
})
test('footer logo stays contained, responsive, and linked to home', () => {
  assert.match(footerSource, /aria-label=["'][^"']*home[^"']*["']/i)
  assert.match(footerSource, /object-contain|objectFit:\s*["']contain["']/)
  assert.match(footerSource, /max-w-full|maxWidth:\s*["']100%["']/)
  assert.match(footerSource, /<Link[\s\S]{0,600}<(?:Image|img)/)
})

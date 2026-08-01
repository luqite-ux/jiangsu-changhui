import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const publicSourceRoots = ['app', 'components', 'lib']
const textExtensions = new Set(['.js', '.jsx', '.json', '.md', '.mjs', '.ts', '.tsx'])
const forbiddenClaim = new RegExp(
  ['质保', '保修', '质量保证', 'warrant' + '(?:y|ies)', 'guarantee' + '(?:d|s|ing)?'].join('|'),
  'iu',
)

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectTextFiles(fullPath)
    return textExtensions.has(path.extname(entry.name)) ? [fullPath] : []
  }))
  return files.flat()
}

test('public customer content contains no warranty or guarantee claims', async () => {
  const files = (await Promise.all(publicSourceRoots.map(collectTextFiles))).flat()
  const violations = []

  for (const file of files) {
    const content = await readFile(file, 'utf8')
    const lines = content.split(/\r?\n/u)
    lines.forEach((line, index) => {
      if (forbiddenClaim.test(line)) {
        violations.push(`${path.relative(process.cwd(), file)}:${index + 1}: ${line.trim()}`)
      }
    })
  }

  assert.deepEqual(violations, [])
})

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readProjectFile = (relativePath) =>
  readFile(resolve(repositoryRoot, relativePath), 'utf8')

const requiredRoutes = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/capabilities/page.tsx',
  'app/products/page.tsx',
  'app/products/[categorySlug]/page.tsx',
  'app/products/[categorySlug]/[productSlug]/page.tsx',
  'app/news/page.tsx',
  'app/news/[slug]/page.tsx',
  'app/contact/page.tsx',
  'app/quality/page.tsx',
  'app/faq/page.tsx',
  'app/not-found.tsx',
]

const workspace = await readProjectFile('pnpm-workspace.yaml')
assert.match(workspace, /^packages:/m, 'root workspace must define packages')
assert.match(workspace, /^overrides:\s*\n\s+hono:\s*4\.12\.25\s*$/m, 'root workspace must pin hono 4.12.25')
assert.doesNotMatch(workspace, /set this to true or false/i, 'workspace must not contain build-approval placeholders')

const packageJson = await readProjectFile('package.json')
assert.doesNotMatch(packageJson, /"pnpm"\s*:\s*\{[\s\S]*?"overrides"/m, 'package.json must not duplicate workspace overrides')

const nextConfig = await readProjectFile('next.config.mjs')
assert.doesNotMatch(nextConfig, /ignoreBuildErrors/, 'Next.js must type-check production builds')

for (const route of requiredRoutes) {
  await readProjectFile(route)
}

console.log(`Baseline contract passed for ${requiredRoutes.length} required routes.`)

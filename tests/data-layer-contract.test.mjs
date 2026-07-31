import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readProjectFile = (relativePath) =>
  readFile(resolve(repositoryRoot, relativePath), 'utf8')

test('the public Supabase client requires the complete tenant configuration', async () => {
  const source = await readProjectFile('lib/supabase.ts')

  for (const name of [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_TENANT_ID',
  ]) {
    assert.match(source, new RegExp(`process\\.env\\.${name}`), `missing ${name}`)
  }
  assert.doesNotMatch(source, /SERVICE_ROLE|service.role/i, 'service-role credentials must never reach the public client')
})

test('product data uses tenant-scoped active rows and keeps an explicit static fallback', async () => {
  const source = await readProjectFile('lib/products-db.ts')

  assert.match(source, /export async function fetchProductsData/)
  assert.match(source, /export async function getProductBySlug/)
  assert.match(source, /from\(["']products["']\)/)
  assert.match(source, /\.eq\(["']tenant_id["'],\s*tenantId\)/)
  assert.match(source, /\.eq\(["']is_active["'],\s*true\)/)
  assert.match(source, /source:\s*["']fallback["']/)
  assert.match(source, /console\.error/)
  assert.match(source, /products\s+as\s+staticProducts|staticProducts/)
})

test('article data reads only published tenant rows and never imports demo news', async () => {
  const source = await readProjectFile('lib/articles-db.ts')

  assert.match(source, /export async function getPublishedArticles/)
  assert.match(source, /export async function getArticleBySlug/)
  assert.match(source, /from\(["']articles["']\)/)
  assert.match(source, /\.eq\(["']tenant_id["'],\s*tenantId\)/)
  assert.match(source, /\.eq\(["']is_published["'],\s*true\)/)
  assert.doesNotMatch(source, /newsArticles|site-data/, 'published articles must not fall back to demo content')
})

test('product and news routes query on the server with 60-second ISR', async () => {
  const routes = [
    ['app/products/page.tsx', 'fetchProductsData', false],
    ['app/products/[categorySlug]/page.tsx', 'fetchProductsData', true],
    ['app/products/[categorySlug]/[productSlug]/page.tsx', 'getProductBySlug', true],
    ['app/news/page.tsx', 'getPublishedArticles', false],
    ['app/news/[slug]/page.tsx', 'getArticleBySlug', true],
  ]

  for (const [relativePath, query, dynamic] of routes) {
    const source = await readProjectFile(relativePath)
    assert.doesNotMatch(source, /^['"]use client['"]/m, `${relativePath} must remain a Server Component`)
    assert.match(source, /export const revalidate\s*=\s*60/, `${relativePath} must use 60-second ISR`)
    assert.match(source, new RegExp(`await\\s+${query}\\(`), `${relativePath} must await ${query}`)
    if (dynamic) {
      assert.match(source, /export const dynamicParams\s*=\s*true/, `${relativePath} must accept new slugs`)
    }
  }

  assert.doesNotMatch(await readProjectFile('app/news/page.tsx'), /newsArticles/)
  assert.doesNotMatch(await readProjectFile('app/news/[slug]/page.tsx'), /newsArticles/)
})

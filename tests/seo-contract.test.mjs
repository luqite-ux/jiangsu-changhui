import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'
import ts from 'typescript'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readProjectFile = (relativePath) =>
  readFile(resolve(repositoryRoot, relativePath), 'utf8')

async function loadTypeScriptModule(relativePath) {
  const source = await readProjectFile(relativePath)
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)
}

test('page metadata resolves canonical, Open Graph and Twitter URLs against the production host', async () => {
  const { SITE_URL, buildPageMetadata } = await loadTypeScriptModule('lib/seo.ts')
  const metadata = buildPageMetadata({
    title: 'KYN28-12 Switchgear',
    description: 'A customer-confirmed product description.',
    path: '/products/hv-switchgear/kyn28-12',
    image: '/products/hv-switchgear.png',
    type: 'website',
  })

  assert.equal(SITE_URL, 'https://changhuielectrical.com')
  assert.equal(metadata.metadataBase.href, `${SITE_URL}/`)
  assert.equal(metadata.alternates.canonical, `${SITE_URL}/products/hv-switchgear/kyn28-12`)
  assert.equal(metadata.openGraph.url, `${SITE_URL}/products/hv-switchgear/kyn28-12`)
  assert.equal(metadata.openGraph.images[0].url, `${SITE_URL}/products/hv-switchgear.png`)
  assert.equal(metadata.twitter.card, 'summary_large_image')
  assert.equal(metadata.twitter.images[0], `${SITE_URL}/products/hv-switchgear.png`)
})

test('www host permanently redirects every path to the canonical apex host', async () => {
  const configUrl = pathToFileURL(resolve(repositoryRoot, 'next.config.mjs')).href
  const { default: nextConfig } = await import(`${configUrl}?domain-redirect-contract`)

  assert.equal(typeof nextConfig.redirects, 'function')
  assert.deepEqual(await nextConfig.redirects(), [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.changhuielectrical.com' }],
      destination: 'https://changhuielectrical.com/:path*',
      permanent: true,
    },
  ])
})

test('non-indexable metadata removes inherited discovery and social URLs', async () => {
  const { buildNoIndexMetadata } = await loadTypeScriptModule('lib/seo.ts')
  const metadata = buildNoIndexMetadata('Page Not Found')

  assert.equal(metadata.title, 'Page Not Found')
  assert.deepEqual(metadata.robots, { index: false, follow: false })
  assert.deepEqual(metadata.alternates, { canonical: null })
  assert.equal(metadata.openGraph, null)
  assert.equal(metadata.twitter, null)
})

test('product metadata keeps the full unique name without a brand suffix and caps factual descriptions', async () => {
  const { buildProductPageMetadata } = await loadTypeScriptModule('lib/seo.ts')
  const name = 'KYN61-40.5 Metal-Clad Withdrawable AC Switchgear'
  const metadata = buildProductPageMetadata({
    name,
    description:
      'Designed for 40.5 kV three-phase AC 50 Hz power systems, with a withdrawable structure and cabinet configuration documented in the customer product catalogue. Additional copy must not make the search description excessively long.',
    category: 'hv-switchgear',
    slug: 'kyn61-40-5',
    image: '/products/hv-switchgear.png',
  })

  assert.deepEqual(metadata.title, { absolute: name })
  assert.ok(metadata.description.startsWith(`${name}. Designed for 40.5 kV`))
  assert.ok(metadata.description.length <= 160)
  assert.equal(metadata.openGraph.title, name)
  assert.equal(metadata.openGraph.description, metadata.description)
})

test('dynamic sitemap contains every public route, active product and published article exactly once', async () => {
  const { products, productCategories } = await loadTypeScriptModule('lib/site-data.ts')
  const { SITE_URL, STATIC_SITEMAP_ROUTES, buildSitemapEntries } = await loadTypeScriptModule('lib/seo.ts')
  const updatedAt = '2026-07-30T08:09:10.000Z'
  const productRows = [
    ...products.map((product) => ({ ...product, updatedAt, isActive: true })),
    { ...products[0], slug: 'inactive-product', updatedAt, isActive: false },
  ]
  const categoryRows = productCategories.map((category) => ({ ...category, updatedAt }))
  const articleRows = [
    { slug: 'published-update', updatedAt, publishedAt: '2026-07-29T00:00:00.000Z', isPublished: true },
    { slug: 'second-published-update', updatedAt, publishedAt: '2026-07-28T00:00:00.000Z', isPublished: true },
    { slug: 'draft-update', updatedAt, publishedAt: '2026-07-27T00:00:00.000Z', isPublished: false },
  ]

  const entries = buildSitemapEntries({
    products: productRows,
    categories: categoryRows,
    articles: articleRows,
  })
  const urls = entries.map(({ url }) => url)

  assert.equal(products.length, 27)
  assert.equal(entries.length, STATIC_SITEMAP_ROUTES.length + productCategories.length + 27 + 2)
  assert.equal(new Set(urls).size, urls.length)
  assert.ok(STATIC_SITEMAP_ROUTES.every((path) => urls.includes(`${SITE_URL}${path === '/' ? '' : path}`)))
  assert.ok(urls.includes(`${SITE_URL}/products/hv-switchgear/kyn28-12`))
  assert.ok(urls.includes(`${SITE_URL}/news/published-update`))
  assert.ok(!urls.some((url) => /inactive-product|draft-update|\/admin|\/api|\/404/.test(url)))
  assert.equal(
    entries.find(({ url }) => url.endsWith('/products/hv-switchgear/kyn28-12')).lastModified.toISOString(),
    updatedAt,
  )
  assert.equal(entries.find(({ url }) => url.endsWith('/news/published-update')).lastModified.toISOString(), updatedAt)
})

test('robots allows the public site while blocking admin, login and API paths and declaring the sitemap', async () => {
  const { SITE_URL, buildRobots } = await loadTypeScriptModule('lib/seo.ts')
  const robots = buildRobots()

  assert.deepEqual(robots.rules, {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin', '/admin/', '/admin/login', '/api', '/api/'],
  })
  assert.equal(robots.sitemap, `${SITE_URL}/sitemap.xml`)
  assert.equal(robots.host, SITE_URL)
})

test('JSON-LD uses verified organization facts and absolute customer media without invented offers', async () => {
  const { company, photos, products } = await loadTypeScriptModule('lib/site-data.ts')
  const {
    SITE_URL,
    buildBreadcrumbJsonLd,
    buildNewsArticleJsonLd,
    buildOrganizationJsonLd,
    buildProductJsonLd,
  } = await loadTypeScriptModule('lib/seo.ts')
  const product = products.find(({ slug }) => slug === 'kyn28-12')
  const organization = buildOrganizationJsonLd(company, photos.logo)
  const productJsonLd = buildProductJsonLd(product)
  const newsJsonLd = buildNewsArticleJsonLd({
    slug: 'published-update',
    title: 'Published update',
    excerpt: 'Verified article excerpt.',
    image: photos.factoryExteriorA,
    publishedAt: '2026-07-29T00:00:00.000Z',
    updatedAt: '2026-07-30T08:09:10.000Z',
  })
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.name, path: `/products/${product.category}/${product.slug}` },
  ])

  assert.equal(organization['@type'], 'Organization')
  assert.equal(organization.name, company.legalName)
  assert.equal(organization.address.streetAddress, company.address)
  assert.equal(organization.logo, photos.logo)
  assert.deepEqual(organization.telephone, company.phones)
  assert.deepEqual(organization.email, company.emails)
  assert.equal(productJsonLd['@type'], 'Product')
  assert.equal(productJsonLd.url, `${SITE_URL}/products/hv-switchgear/kyn28-12`)
  assert.ok(productJsonLd.image.every((url) => url.startsWith('https://')))
  assert.ok(!('offers' in productJsonLd))
  assert.equal(newsJsonLd['@type'], 'NewsArticle')
  assert.equal(newsJsonLd.dateModified, '2026-07-30T08:09:10.000Z')
  assert.equal(newsJsonLd.image[0], photos.factoryExteriorA)
  assert.equal(breadcrumb.itemListElement.at(-1).item, productJsonLd.url)
})

test('JSON-LD serialization cannot terminate its script element', async () => {
  const { serializeJsonLd } = await loadTypeScriptModule('lib/seo.ts')
  const serialized = serializeJsonLd({ headline: '</script><script>alert(1)</script>' })

  assert.equal(serialized.includes('</script>'), false)
  assert.match(serialized, /\\u003c\/script\\u003e/)
})

test('public route components keep one visible h1 source and meaningful image alternatives', async () => {
  const detailFiles = [
    'app/products/[categorySlug]/[productSlug]/product-detail-client.tsx',
    'app/news/[slug]/news-article-client.tsx',
  ]

  for (const file of detailFiles) {
    const source = await readProjectFile(file)
    assert.equal((source.match(/<h1\b/g) ?? []).length, 1, `${file} must render exactly one h1`)
    assert.doesNotMatch(source, /<Image[^>]+alt=["']\s*["']/s, `${file} must not render an empty content-image alt`)
  }

  const layout = await readProjectFile('app/layout.tsx')
  assert.match(layout, /icons:/, 'the root metadata must publish favicon declarations')
  assert.match(await readProjectFile('components/site-header.tsx'), /alt=\{`\$\{company\.name\} logo`\}/)
})

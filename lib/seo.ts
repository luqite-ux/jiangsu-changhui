import type { Metadata, MetadataRoute } from 'next'

export const SITE_URL = 'https://changhuielectrical.com'
export const SITE_NAME = 'CHANG HUI ELECTRIC'
export const LEGAL_NAME = 'Jiangsu Changhui Electric Co., Ltd.'
export const DEFAULT_OG_IMAGE = '/logo.png'
export const STATIC_SITEMAP_ROUTES = [
  '/',
  '/about',
  '/products',
  '/capabilities',
  '/quality',
  '/news',
  '/faq',
  '/contact',
] as const

type PageMetadataInput = {
  title: string
  description: string
  path: string
  image?: string | null
  type?: 'website' | 'article'
}

type CompanyFacts = {
  legalName: string
  address: string
  phones: string[]
  emails: string[]
}

type ProductSeoRecord = {
  slug: string
  name: string
  category: string
  description: string
  image: string
  images?: string[]
  updatedAt?: string | null
  isActive?: boolean
}

type ProductMetadataRecord = Pick<
  ProductSeoRecord,
  'name' | 'description' | 'category' | 'slug' | 'image'
>

type CategorySeoRecord = {
  slug: string
  updatedAt?: string | null
}

type ArticleSeoRecord = {
  slug: string
  title?: string
  excerpt?: string
  image?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  isPublished?: boolean
}

type BreadcrumbItem = {
  name: string
  path: string
}

export function absoluteUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return `${SITE_URL}${DEFAULT_OG_IMAGE}`
  if (pathOrUrl === '/' || pathOrUrl === SITE_URL || pathOrUrl === `${SITE_URL}/`) return SITE_URL

  try {
    const url = new URL(pathOrUrl, `${SITE_URL}/`)
    return url.protocol === 'https:' ? url.href : `${SITE_URL}${DEFAULT_OG_IMAGE}`
  } catch {
    return `${SITE_URL}${DEFAULT_OG_IMAGE}`
  }
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_US',
      images: [{ url: imageUrl, alt: `${title} — ${SITE_NAME}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export function buildNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
    alternates: { canonical: null },
    openGraph: null,
    twitter: null,
  }
}

function compactMetadataDescription(value: string, maxLength = 160): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized

  const clipped = normalized.slice(0, maxLength - 1)
  const wordBoundary = clipped.lastIndexOf(' ')
  const safeBoundary = wordBoundary >= Math.floor(maxLength * 0.75) ? wordBoundary : clipped.length
  return `${clipped.slice(0, safeBoundary).replace(/[\s,;:.!?-]+$/g, '')}…`
}

export function buildProductPageMetadata(product: ProductMetadataRecord): Metadata {
  const description = compactMetadataDescription(`${product.name}. ${product.description}`)
  const metadata = buildPageMetadata({
    title: product.name,
    description,
    path: `/products/${product.category}/${product.slug}`,
    image: product.image,
  })

  return {
    ...metadata,
    title: { absolute: product.name },
  }
}

function validDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function sitemapEntry(path: string, lastModified?: string | null): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    ...(validDate(lastModified) ? { lastModified: validDate(lastModified) } : {}),
  }
}

export function buildSitemapEntries({
  products,
  categories = [],
  articles,
}: {
  products: ProductSeoRecord[]
  categories?: CategorySeoRecord[]
  articles: ArticleSeoRecord[]
}): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    ...STATIC_SITEMAP_ROUTES.map((path) => sitemapEntry(path)),
    ...categories
      .filter(({ slug }) => Boolean(slug))
      .map(({ slug, updatedAt }) => sitemapEntry(`/products/${encodeURIComponent(slug)}`, updatedAt)),
    ...products
      .filter(({ slug, category, isActive }) => Boolean(slug && category) && isActive !== false)
      .map(({ slug, category, updatedAt }) =>
        sitemapEntry(
          `/products/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`,
          updatedAt,
        ),
      ),
    ...articles
      .filter(({ slug, isPublished }) => Boolean(slug) && isPublished !== false)
      .map(({ slug, updatedAt, publishedAt }) =>
        sitemapEntry(`/news/${encodeURIComponent(slug)}`, updatedAt || publishedAt),
      ),
  ]

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()]
}

export function buildRobots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/admin/login', '/api', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

export function buildOrganizationJsonLd(company: CompanyFacts, logo: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: company.legalName,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(logo),
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
    },
    telephone: company.phones,
    email: company.emails,
  }
}

export function buildProductJsonLd(product: ProductSeoRecord) {
  const url = absoluteUrl(`/products/${product.category}/${product.slug}`)
  const images = [...new Set([product.image, ...(product.images ?? [])].map(absoluteUrl))]

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.description,
    image: images,
    url,
    manufacturer: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: LEGAL_NAME,
    },
  }
}

export function buildNewsArticleJsonLd(article: ArticleSeoRecord) {
  const url = absoluteUrl(`/news/${article.slug}`)
  const image = absoluteUrl(article.image)

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    image: [image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: url,
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: LEGAL_NAME,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: LEGAL_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
  }
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

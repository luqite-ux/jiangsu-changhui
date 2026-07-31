import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/app/products/[categorySlug]/[productSlug]/product-detail-client'
import { fetchProductsData, getProductBySlug } from '@/lib/products-db'
import {
  buildBreadcrumbJsonLd,
  buildNoIndexMetadata,
  buildProductPageMetadata,
  buildProductJsonLd,
  serializeJsonLd,
} from '@/lib/seo'

export const revalidate = 60
export const dynamicParams = true

type Props = { params: Promise<{ categorySlug: string; productSlug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug)
  if (!product) return buildNoIndexMetadata('Product Not Found')
  return buildProductPageMetadata(product)
}

export default async function ProductDetailPage({ params }: Props) {
  const { categorySlug, productSlug } = await params
  const product = await getProductBySlug(productSlug)
  if (!product || product.category !== categorySlug) notFound()

  const { products } = await fetchProductsData()
  const related = product.relatedSlugs
    .map((slug) => products.find((candidate) => candidate.slug === slug))
    .filter((candidate) => candidate !== undefined)

  const productJsonLd = buildProductJsonLd(product)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.categoryName, path: `/products/${product.category}` },
    { name: product.name, path: `/products/${product.category}/${product.slug}` },
  ])

  return (
    <>
      <script
        id="product-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        id="product-breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  )
}

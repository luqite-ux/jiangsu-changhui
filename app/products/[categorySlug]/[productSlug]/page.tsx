import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/app/products/[categorySlug]/[productSlug]/product-detail-client'
import { fetchProductsData, getProductBySlug } from '@/lib/products-db'

export const revalidate = 60
export const dynamicParams = true

type Props = { params: Promise<{ categorySlug: string; productSlug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug)
  if (!product) return {}
  return {
    title: product.name,
    description: `${product.name} — manufactured by Jiangsu Changhui Electric. ${product.description.slice(0, 140)}`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { categorySlug, productSlug } = await params
  const product = await getProductBySlug(productSlug)
  if (!product || product.category !== categorySlug) notFound()

  const { products } = await fetchProductsData()
  const related = product.relatedSlugs
    .map((slug) => products.find((candidate) => candidate.slug === slug))
    .filter((candidate) => candidate !== undefined)

  return <ProductDetailClient product={product} related={related} />
}

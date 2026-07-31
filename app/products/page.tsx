import type { Metadata } from 'next'
import { ProductsPageClient } from '@/app/products/products-page-client'
import { fetchProductsData } from '@/lib/products-db'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Products',
  description:
    "Explore Chang Hui Electric's customer-supplied list of 27 made-to-order products across 6 categories.",
}

export default async function ProductsPage() {
  const { products, categories } = await fetchProductsData()
  return <ProductsPageClient products={products} categories={categories} />
}

import type { MetadataRoute } from 'next'
import { getPublishedArticles } from '@/lib/articles-db'
import { fetchProductsData } from '@/lib/products-db'
import { buildSitemapEntries } from '@/lib/seo'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ products, categories, source }, articles] = await Promise.all([
    fetchProductsData(),
    getPublishedArticles(),
  ])

  return buildSitemapEntries({
    products: source === 'supabase' ? products : [],
    categories: source === 'supabase' ? categories : [],
    articles,
  })
}

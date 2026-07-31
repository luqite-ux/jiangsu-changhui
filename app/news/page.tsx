import type { Metadata } from 'next'
import { NewsPageClient } from '@/app/news/news-page-client'
import { getPublishedArticles } from '@/lib/articles-db'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = buildPageMetadata({
  title: 'News & Updates',
  description:
    'News, manufacturing insights and updates from Chang Hui Electric (Jiangsu Changhui Electric Co., Ltd.) — switchgear, busway and distribution equipment manufacturer.',
  path: '/news',
})

export default async function NewsPage() {
  const articles = await getPublishedArticles()
  return <NewsPageClient articles={articles} />
}

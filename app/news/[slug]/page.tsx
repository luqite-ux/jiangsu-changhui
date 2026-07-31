import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NewsArticleClient } from '@/app/news/[slug]/news-article-client'
import { getArticleBySlug, getPublishedArticles } from '@/lib/articles-db'

export const revalidate = 60
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return { title: article.title, description: article.excerpt }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const articles = await getPublishedArticles()
  const related = articles.filter((candidate) => candidate.slug !== slug).slice(0, 3)
  return <NewsArticleClient article={article} related={related} />
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NewsArticleClient } from '@/app/news/[slug]/news-article-client'
import { getArticleBySlug, getPublishedArticles } from '@/lib/articles-db'
import {
  buildBreadcrumbJsonLd,
  buildNewsArticleJsonLd,
  buildNoIndexMetadata,
  buildPageMetadata,
  serializeJsonLd,
} from '@/lib/seo'

export const revalidate = 60
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return buildNoIndexMetadata('Article Not Found')
  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    image: article.image,
    type: 'article',
  })
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const articles = await getPublishedArticles()
  const related = articles.filter((candidate) => candidate.slug !== slug).slice(0, 3)
  const articleJsonLd = buildNewsArticleJsonLd(article)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: article.title, path: `/news/${article.slug}` },
  ])

  return (
    <>
      <script
        id="news-article-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <script
        id="news-breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <NewsArticleClient article={article} related={related} />
    </>
  )
}

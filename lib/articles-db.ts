import { getSupabaseClient, getTenantId } from '@/lib/supabase'

type ArticleRow = {
  slug: string | null
  title: string | null
  title_en: string | null
  excerpt: string | null
  excerpt_en: string | null
  content: string | null
  content_en: string | null
  featured_image: string | null
  published_at: string | null
  created_at: string
  updated_at: string | null
}

export type ArticleSummary = {
  slug: string
  title: string
  excerpt: string
  image: string | null
  publishedAt: string
  category: string
  updatedAt: string
}

export type ArticleDetail = ArticleSummary & {
  content: string
}

const articleSelection =
  'slug,title,title_en,excerpt,excerpt_en,content,content_en,featured_image,published_at,created_at,updated_at'

function mapArticleRow(row: ArticleRow): ArticleDetail {
  return {
    slug: row.slug || '',
    title: row.title_en || row.title || 'Untitled article',
    excerpt: row.excerpt_en || row.excerpt || '',
    content: row.content_en || row.content || '',
    image: row.featured_image,
    publishedAt: row.published_at || row.created_at,
    category: 'Company News',
    updatedAt: row.updated_at || row.published_at || row.created_at,
  }
}

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  const client = getSupabaseClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) {
    console.error('[articles-db] public Supabase configuration is incomplete; returning an empty news list.')
    return []
  }

  const { data, error } = await client
    .from('articles')
    .select(articleSelection)
    .eq('tenant_id', tenantId)
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error || !data) {
    console.error('[articles-db] published article query failed.', error?.message)
    return []
  }

  return (data as ArticleRow[]).map(mapArticleRow)
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const client = getSupabaseClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) {
    console.error('[articles-db] public Supabase configuration is incomplete; article is unavailable.')
    return null
  }

  const { data, error } = await client
    .from('articles')
    .select(articleSelection)
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) {
    console.error('[articles-db] article query failed.', error.message)
    return null
  }

  return data ? mapArticleRow(data as ArticleRow) : null
}

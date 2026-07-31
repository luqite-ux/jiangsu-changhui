'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import type { ArticleDetail, ArticleSummary } from '@/lib/articles-db'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function NewsArticleClient({ article, related }: { article: ArticleDetail; related: ArticleSummary[] }) {
  return (
    <>
      <div className="border-b border-border bg-card/60 pt-20">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8"><Link href="/news" className="hover:text-primary">News</Link><span>/</span><span className="line-clamp-1 text-foreground">{article.title}</span></div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"><Tag className="h-3 w-3" aria-hidden />{article.category}</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" aria-hidden />{formatDate(article.publishedAt)}</span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-primary text-balance sm:text-4xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
        </Reveal>

        {article.image && (
          <Reveal className="mt-8 overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl shadow-primary/8">
            <Image src={article.image} alt={article.title} width={896} height={504} className="aspect-[16/9] w-full object-cover" priority />
          </Reveal>
        )}

        <Reveal delay={80}>
          <div className="article-prose mt-10 max-w-none text-foreground/85" dangerouslySetInnerHTML={{ __html: article.content }} />
        </Reveal>

        <div className="mt-12 border-t border-border pt-8">
          <Link href="/news" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden />Back to News</Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-primary">More Articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 80}>
                  <Link href={`/news/${item.slug}`} className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">{item.image ? <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" /> : <div className="h-full bg-primary/80" aria-hidden />}</div>
                    <div className="min-w-0 flex-1"><p className="text-xs font-medium text-accent">{item.category}</p><p className="mt-0.5 text-sm font-semibold leading-snug text-primary line-clamp-2">{item.title}</p><span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">Read more<ArrowRight className="h-3 w-3" aria-hidden /></span></div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

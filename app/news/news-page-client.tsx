'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import type { ArticleSummary } from '@/lib/articles-db'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function NewsPageClient({ articles }: { articles: ArticleSummary[] }) {
  const [featured, ...rest] = articles

  return (
    <>
      <PageHero breadcrumb="News" eyebrow="News & Updates" title="Company News & Industry Insights" description="Stay up to date with manufacturing process improvements, product updates and company announcements from Jiangsu Changhui Electric." />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {!featured ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="font-display text-xl font-bold text-primary">No published articles yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Company updates will appear here after publication.</p>
          </div>
        ) : (
          <>
            <Reveal>
              <Link href={`/news/${featured.slug}`} className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 lg:grid-cols-2">
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary lg:aspect-auto">
                  {featured.image ? <Image src={featured.image} alt={featured.title} fill priority className="object-cover object-top transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" /> : <div className="h-full min-h-64 bg-gradient-to-br from-primary to-primary/70" aria-hidden />}
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"><Tag className="h-3 w-3" aria-hidden />{featured.category}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" aria-hidden />{formatDate(featured.publishedAt)}</span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold leading-snug text-primary text-balance sm:text-2xl">{featured.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{featured.excerpt}</p>
                  <span className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">Read more<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
                </div>
              </Link>
            </Reveal>

            {rest.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, index) => (
                  <Reveal key={article.slug} delay={(index % 3) * 80}>
                    <Link href={`/news/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                        {article.image ? <Image src={article.image} alt={article.title} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : <div className="h-full bg-gradient-to-br from-primary to-primary/70" aria-hidden />}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">{article.category}</span><span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span></div>
                        <h2 className="mt-3 font-display text-base font-semibold leading-snug text-primary line-clamp-2">{article.title}</h2>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{article.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">Read more<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden /></span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}

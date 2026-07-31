'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Boxes } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import type { Product, ProductCategory } from '@/lib/site-data'
import { cn } from '@/lib/utils'

type Props = { products: Product[]; categories: ProductCategory[] }

export function ProductsPageClient({ products, categories }: Props) {
  return (
    <>
      <PageHero
        breadcrumb="Products"
        eyebrow="Product Range"
        title={`${products.length} Products Across ${categories.length} Categories`}
        description="Every product is custom manufactured to your project drawings and applicable standards. Browse our core categories or jump straight to a specific product."
      />

      <nav aria-label="Product categories" className="sticky top-16 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`#${cat.slug}`} className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:bg-secondary hover:text-primary">
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="font-display text-xl font-bold text-primary">Product catalog is being updated</h2>
            <p className="mt-2 text-sm text-muted-foreground">Please contact us for the current product range.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {categories.map((cat, i) => {
              const reversed = i % 2 === 1
              const catProducts = products.filter((product) => product.category === cat.slug)

              return (
                <section key={cat.slug} id={cat.slug} className="scroll-mt-36">
                  <div className={cn('grid items-start gap-10 lg:grid-cols-2')}>
                    <Reveal className={cn(reversed && 'lg:order-2')}>
                      <div className="group relative overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl shadow-primary/8">
                        <Image src={cat.image} alt={cat.imageAlt ?? 'Manufacturing reference — customer-supplied photo, not model-specific.'} width={720} height={540} className="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                          <Boxes className="h-3.5 w-3.5" aria-hidden />
                          {String(i + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                        </span>
                        <p className="absolute inset-x-4 bottom-4 rounded-md bg-slate-950/90 px-3 py-2 text-xs font-medium leading-snug text-white shadow-sm backdrop-blur-sm">
                          {cat.imageContext ?? 'Manufacturing reference — customer-supplied photo, not model-specific.'}
                        </p>
                      </div>
                    </Reveal>

                    <Reveal delay={100} className={cn(reversed && 'lg:order-1')}>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        <span className="h-px w-4 bg-accent" aria-hidden />
                        {catProducts.length} Product{catProducts.length !== 1 ? 's' : ''}
                      </span>
                      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-primary text-balance sm:text-3xl">{cat.name}</h2>
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{cat.short}</p>

                      <ul className="mt-5 space-y-2" role="list">
                        {catProducts.map((prod) => (
                          <li key={prod.slug}>
                            <Link href={`/products/${prod.category}/${prod.slug}`} className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-primary">
                              <span>{prod.name}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" aria-hidden />
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <Link href={`/products/${cat.slug}`} className="group mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
                        View {cat.name}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </Link>
                    </Reveal>
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center shadow-xl shadow-primary/20 sm:px-12">
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold text-white text-balance sm:text-3xl">{"Can't find exactly what you need?"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80 text-pretty">We manufacture to order. Share your drawings or specifications and we will build a tailored solution.</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:-translate-y-0.5">
              Talk to Our Engineers
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}

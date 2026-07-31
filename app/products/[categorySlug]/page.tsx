import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, Tag } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { fetchProductsData } from '@/lib/products-db'

export const revalidate = 60
export const dynamicParams = true

type Props = { params: Promise<{ categorySlug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params
  const { categories } = await fetchProductsData()
  const cat = categories.find((category) => category.slug === categorySlug)
  if (!cat) return {}
  return {
    title: cat.name,
    description: `${cat.name} products by Jiangsu Changhui Electric — ${cat.short} Custom-built to your project drawings.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params
  const { categories, products } = await fetchProductsData()
  const cat = categories.find((category) => category.slug === categorySlug)
  if (!cat) notFound()

  const catProducts = products.filter((product) => product.category === categorySlug)

  return (
    <>
      <PageHero
        breadcrumb={cat.name}
        eyebrow="Products"
        title={cat.name}
        description={cat.short}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/products" className="flex items-center gap-1.5 hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{cat.name}</span>
        </div>
      </div>

      {/* Product grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {catProducts.map((prod, i) => (
            <Reveal key={prod.slug} delay={(i % 3) * 80}>
              <Link
                href={`/products/${categorySlug}/${prod.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <Image
                    src={prod.image}
                    alt={`Neutral category illustration for ${prod.name}`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-base font-semibold leading-snug text-primary">
                      {prod.name}
                    </h2>
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {prod.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {prod.applications.slice(0, 3).map((app) => (
                      <span
                        key={app}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        <Tag className="h-2.5 w-2.5" aria-hidden />
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-2xl bg-primary px-8 py-12 text-center shadow-xl shadow-primary/20">
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              Need a custom {cat.name} solution?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-white/75 text-pretty">
              Share your single-line diagram, quantity and project requirements for review and quotation.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}

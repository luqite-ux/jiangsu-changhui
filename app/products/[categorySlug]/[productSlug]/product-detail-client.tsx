'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Tag, Info } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import type { Product } from '@/lib/site-data'

type Props = { product: Product; related: Product[] }

export function ProductDetailClient({ product, related }: Props) {
  const images = product.images?.length ? product.images : [product.image]

  return (
    <>
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/products" className="hover:text-primary">All Products</Link><span>/</span>
          <Link href={`/products/${product.category}`} className="hover:text-primary">{product.categoryName}</Link><span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl shadow-primary/8">
                <Image src={images[0]} alt={product.name} fill priority className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1, 5).map((image) => (
                    <div key={image} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
                      <Image src={image} alt={`${product.name} gallery view`} fill className="object-cover" sizes="20vw" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{product.categoryName}</span>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-primary text-balance sm:text-3xl">{product.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{product.description}</p>

            {product.applications.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/75">Typical Applications</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.applications.map((application) => (
                    <span key={application} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/80">
                      <Tag className="h-3 w-3 text-accent" aria-hidden />{application}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div><p className="text-sm font-semibold text-foreground">Built to Your Specifications</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{product.customNote}</p></div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/75">What to Include in Your Enquiry</h2>
              <ul className="mt-3 space-y-2" role="list">
                {['Single-line diagram or electrical drawings','Required voltage class and rated current','Number of units and cabinet lineup arrangement','Installation environment (indoor/outdoor, altitude, temperature)','Applicable standards (GB, IEC, or project-specific)'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5">Request a Quote<ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href={`/products/${product.category}`} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"><ArrowLeft className="h-4 w-4" aria-hidden />Back to {product.categoryName}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-primary">Related Products</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 80}>
                  <Link href={`/products/${item.category}/${item.slug}`} className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"><Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" /></div>
                    <div className="min-w-0 flex-1"><p className="text-xs font-medium text-accent">{item.categoryName}</p><p className="mt-0.5 text-sm font-semibold leading-snug text-primary line-clamp-2">{item.name}</p><span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary">View details<ArrowRight className="h-3 w-3" aria-hidden /></span></div>
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

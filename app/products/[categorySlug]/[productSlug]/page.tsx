import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Tag, Info } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { products, productCategories, getProduct, getRelatedProducts } from '@/lib/site-data'

type Props = { params: Promise<{ categorySlug: string; productSlug: string }> }

export async function generateStaticParams() {
  return products.map((p) => ({
    categorySlug: p.category,
    productSlug: p.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  const prod = getProduct(productSlug)
  if (!prod) return {}
  return {
    title: prod.name,
    description: `${prod.name} — manufactured by Jiangsu Changhui Electric. ${prod.description.slice(0, 140)}`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { categorySlug, productSlug } = await params
  const prod = getProduct(productSlug)
  if (!prod || prod.category !== categorySlug) notFound()

  const cat = productCategories.find((c) => c.slug === categorySlug)
  const related = getRelatedProducts(prod)
  const images = prod.images ?? [prod.image]

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/products" className="hover:text-primary">All Products</Link>
          <span>/</span>
          <Link href={`/products/${categorySlug}`} className="hover:text-primary">{prod.categoryName}</Link>
          <span>/</span>
          <span className="text-foreground">{prod.name}</span>
        </div>
      </div>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Image gallery */}
          <Reveal>
            <div className="space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl shadow-primary/8">
                <Image
                  src={images[0]}
                  alt={`Neutral category illustration for ${prod.name}`}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1, 5).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary"
                    >
                      <Image
                        src={img}
                        alt={`Neutral category illustration for ${prod.name}`}
                        fill
                        className="object-cover"
                        sizes="20vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={100}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {prod.categoryName}
            </span>

            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-primary text-balance sm:text-3xl">
              {prod.name}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {prod.description}
            </p>

            {/* Applications */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/75">
                Typical Applications
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {prod.applications.map((app) => (
                  <span
                    key={app}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/80"
                  >
                    <Tag className="h-3 w-3 text-accent" aria-hidden />
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Custom note */}
            <div className="mt-6 flex gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-foreground">Built to Your Specifications</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{prod.customNote}</p>
              </div>
            </div>

            {/* What to send */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/75">
                What to Include in Your Enquiry
              </h2>
              <ul className="mt-3 space-y-2" role="list">
                {[
                  'Single-line diagram or electrical drawings',
                  'Required voltage class and rated current',
                  'Number of units and cabinet lineup arrangement',
                  'Installation environment (indoor/outdoor, altitude, temperature)',
                  'Applicable standards (GB, IEC, or project-specific)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/contact?product=${encodeURIComponent(prod.name)}`}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={`/products/${categorySlug}`}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to {prod.categoryName}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-primary">Related Products</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel, i) => (
                <Reveal key={rel.slug} delay={i * 80}>
                  <Link
                    href={`/products/${rel.category}/${rel.slug}`}
                    className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={rel.image}
                        alt={`Neutral category illustration for ${rel.name}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-accent">{rel.categoryName}</p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-primary line-clamp-2">
                        {rel.name}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary">
                        View details
                        <ArrowRight className="h-3 w-3" aria-hidden />
                      </span>
                    </div>
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

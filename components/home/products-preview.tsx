import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { productCategories } from '@/lib/site-data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function ProductsPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Product Range"
        title="27 Products Across 6 Categories"
        description="From medium-voltage switchgear to busway, cable management and prefabricated substations — every product is custom-built to your project drawings and specifications."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productCategories.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 100}>
            <Link
              href={`/products/${p.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-primary">{p.name}</h3>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.short}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.products.slice(0, 3).map((prod) => (
                    <span
                      key={prod.slug}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {prod.name.split(' ')[0]}
                    </span>
                  ))}
                  {p.products.length > 3 && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      +{p.products.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          View All 27 Products
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}

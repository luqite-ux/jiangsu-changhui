import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { buildNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = buildNoIndexMetadata('Page Not Found')

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Zap className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">Page Not Found</h2>
      <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground text-pretty">
        The page you are looking for does not exist or has been moved. Try browsing our products or get in touch with our team.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Browse Products
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}

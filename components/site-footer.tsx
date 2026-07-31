import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { company, nav, photos, productCategories } from '@/lib/site-data'

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="inline-flex items-center rounded-lg bg-white px-3 py-2.5 shadow-sm">
              <Image
                src={photos.logo}
                alt={`${company.name} logo`}
                width={150}
                height={50}
                className="h-11 w-auto object-contain"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/85">
              {company.legalName}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/85">
              {company.cnName}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/75">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/75">
              Products
            </h3>
            <ul className="mt-4 space-y-2.5">
              {productCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-primary-foreground/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/75">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/90">
              {company.phones.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-accent-on-dark" aria-hidden />
                  <a href={`tel:${p.replace(/[^+\d]/g, '')}`} className="hover:text-white focus-visible:outline-none focus-visible:underline">
                    {p}
                  </a>
                </li>
              ))}
              {company.emails.map((e) => (
                <li key={e} className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent-on-dark" aria-hidden />
                  <a href={`mailto:${e}`} className="hover:text-white focus-visible:outline-none focus-visible:underline break-all">
                    {e}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-on-dark" aria-hidden />
                <span>{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/25 pt-6 text-xs text-primary-foreground/75 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

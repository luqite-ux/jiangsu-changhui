'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { nav, company } from '@/lib/site-data'

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md transition-shadow duration-300',
        scrolled
          ? 'shadow-sm'
          : 'shadow-none',
      )}
    >
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:min-h-[88px] lg:gap-4 lg:px-8 lg:py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3" aria-label={company.name}>
          <Image
            src="/logo-symbol.png"
            alt=""
            width={192}
            height={192}
            className="h-14 w-14 shrink-0 object-contain lg:h-16 lg:w-16"
            priority
          />
          <span className="flex flex-col font-serif text-[15px] font-bold leading-[0.88] tracking-[0.025em] text-primary sm:text-base lg:text-lg">
            <span>CHANG HUI</span>
            <span>ELECTRIC</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
                  active ? 'text-primary' : 'text-foreground/70 hover:text-primary',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300',
                    active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary/90 md:inline-flex"
          >
            <Phone className="h-4 w-4" />
            Get a Quote
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/60 text-foreground lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {nav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'min-h-12 rounded-md px-4 py-3 text-base font-medium transition-colors',
                    active ? 'bg-secondary text-primary' : 'text-foreground/80 hover:bg-secondary',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-base font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" />
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

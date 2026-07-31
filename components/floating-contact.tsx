'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export function FloatingContact() {
  return (
    <Link
      href="/contact"
      aria-label="Open the Chang Hui Electric contact page"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/20 transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <MessageSquare className="h-6 w-6" aria-hidden />
    </Link>
  )
}

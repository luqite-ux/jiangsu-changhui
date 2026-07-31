'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = { q: string; a: string }

export function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/60"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-primary">{item.q}</span>
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-all duration-300',
                  isOpen && 'rotate-45 bg-accent text-accent-foreground',
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

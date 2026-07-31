import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  invert = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  invert?: boolean
}) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em]',
            invert ? 'text-accent-on-dark' : 'text-accent',
          )}
        >
          <span className={cn('h-px w-6', invert ? 'bg-accent-on-dark' : 'bg-accent')} />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl',
          invert ? 'text-white' : 'text-primary',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-lg leading-relaxed text-pretty',
            invert ? 'text-white/80' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}

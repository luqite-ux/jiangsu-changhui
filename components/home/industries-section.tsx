import {
  Factory,
  Flame,
  Zap,
  Building2,
  Heart,
  Home,
  FlaskConical,
  Warehouse,
  Train,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory,
  Flame,
  Zap,
  Building2,
  Heart,
  Home,
  FlaskConical,
  Warehouse,
  Train,
}

const industries = [
  { icon: 'Factory', label: 'Industrial & Mining' },
  { icon: 'Flame', label: 'Petrochemical' },
  { icon: 'Zap', label: 'Power & Water Utilities' },
  { icon: 'Building2', label: 'Infrastructure' },
  { icon: 'Heart', label: 'Healthcare' },
  { icon: 'Home', label: 'Residential & Commercial' },
  { icon: 'FlaskConical', label: 'Research & Science' },
  { icon: 'Warehouse', label: 'Warehousing & Logistics' },
  { icon: 'Train', label: 'Transportation' },
]

export function IndustriesSection() {
  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries Served"
          title="Equipment for Every Application"
          description="Chang Hui Electric products are deployed across a wide range of industries — from heavy industry and utilities to healthcare, residential and transportation infrastructure."
        />

        <Reveal>
          <ul
            className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            role="list"
          >
            {industries.map((ind) => {
              const Icon = iconMap[ind.icon]
              return (
                <li
                  key={ind.label}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
                >
                  {Icon && (
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground">{ind.label}</span>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

import { stats } from '@/lib/site-data'
import { CountUp } from '@/components/count-up'
import { Reveal } from '@/components/reveal'

export function StatsStrip() {
  return (
    <section className="relative z-10 mx-auto mt-8 max-w-6xl px-4 sm:mt-10 sm:px-6 lg:mt-12 lg:px-8">
      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-primary/5 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 100}
            className="border-border p-6 text-center [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r"
          >
            <div className="font-display text-3xl font-bold text-primary sm:text-4xl">
              <CountUp value={s.value} />
              <span className="text-accent">{s.suffix}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

export function CountUp({
  value,
  duration = 1600,
  className,
}: {
  value: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const started = useRef(false)

  // Parse a numeric target from strings like "42,000" or "1,000"
  const target = Number(value.replace(/[^0-9.]/g, ''))
  const hasNumber = !Number.isNaN(target) && target > 0

  useEffect(() => {
    if (!hasNumber) {
      setDisplay(value)
      return
    }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = Math.round(target * eased)
              setDisplay(current.toLocaleString('en-US'))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, hasNumber, value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

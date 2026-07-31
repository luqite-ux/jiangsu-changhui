import type { Metadata } from 'next'
import { buildNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = buildNoIndexMetadata('网站管理后台登录')

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 [&_input]:bg-white [&_input]:text-slate-950">
      {children}
    </div>
  )
}

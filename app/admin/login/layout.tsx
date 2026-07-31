import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '网站管理后台登录',
  robots: { index: false, follow: false },
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 [&_input]:bg-white [&_input]:text-slate-950">
      {children}
    </div>
  )
}

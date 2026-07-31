import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingContact } from '@/components/floating-contact'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const metadata: Metadata = {
  metadataBase: productionHost ? new URL(`https://${productionHost}`) : undefined,
  title: {
    default: 'CHANG HUI ELECTRIC | HV & LV Switchgear, Busway & Cable Tray Manufacturer',
    template: '%s | CHANG HUI ELECTRIC',
  },
  description:
    'Jiangsu Changhui Electric Co., Ltd. lists high and low voltage switchgear, distribution boxes, busway systems, cable trays and related made-to-order electrical equipment.',
  keywords: [
    'switchgear manufacturer',
    'busway system',
    'cable tray',
    'distribution box',
    'transformer',
    'Chang Hui Electric',
    'Jiangsu Changhui Electric',
    'electrical equipment supplier China',
  ],
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'CHANG HUI ELECTRIC',
    description:
      'Made-to-order electrical distribution equipment based on customer drawings and project requirements.',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a2a5e',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background font-sans antialiased">
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <FloatingContact />
        {process.env.NODE_ENV === 'production' && process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}

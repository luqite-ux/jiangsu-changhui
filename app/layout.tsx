import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingContact } from '@/components/floating-contact'
import { company, photos } from '@/lib/site-data'
import { buildOrganizationJsonLd, buildPageMetadata, serializeJsonLd } from '@/lib/seo'
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

const homeDescription =
  'Jiangsu Changhui Electric Co., Ltd. lists high and low voltage switchgear, distribution boxes, busway systems, cable trays and related made-to-order electrical equipment.'
const homeSeo = buildPageMetadata({
  title: 'CHANG HUI ELECTRIC | HV & LV Switchgear, Busway & Cable Tray Manufacturer',
  description: homeDescription,
  path: '/',
})
const organizationJsonLd = buildOrganizationJsonLd(company, photos.logo)

export const metadata: Metadata = {
  ...homeSeo,
  title: {
    default: 'CHANG HUI ELECTRIC | HV & LV Switchgear, Busway & Cable Tray Manufacturer',
    template: '%s | CHANG HUI ELECTRIC',
  },
  description: homeDescription,
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
      <head>
        <script
          id="organization-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
        />
      </head>
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

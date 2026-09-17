import type { Metadata } from 'next'
import { ServiceExpiredPage } from '../../components/service-expired-page'

export const metadata: Metadata = { title: 'Service Notice', robots: { index: false, follow: false } }
export default function Page() { return <ServiceExpiredPage locale="en" /> }

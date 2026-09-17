export const SERVICE_GUARD_VERSION = '1'

interface StatusPayload { available?: boolean; status?: string; version?: number }

export async function isWebsiteServiceAvailable(): Promise<boolean> {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/\/$/, '')
  if (!tenantId || !adminUrl) return true
  try {
    const response = await fetch(`${adminUrl}/api/public/service-status/${encodeURIComponent(tenantId)}`, {
      signal: AbortSignal.timeout(2000), next: { revalidate: 60 },
    })
    if (!response.ok) return true
    const payload = await response.json() as StatusPayload
    return !(payload.version === 1 && payload.available === false && payload.status === 'expired')
  } catch { return true }
}

export function isServiceGuardExcludedPath(pathname: string): boolean {
  return pathname === '/service-expired' || pathname.startsWith('/admin') || pathname.startsWith('/api')
    || pathname.startsWith('/_next') || pathname === '/favicon.ico' || /\.[a-z0-9]+$/i.test(pathname)
}


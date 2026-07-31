import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let publicClient: SupabaseClient | null | undefined

function readPublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()

  return { url, anonKey, tenantId }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (publicClient !== undefined) return publicClient

  const { url, anonKey, tenantId } = readPublicConfig()
  publicClient =
    url && anonKey && tenantId
      ? createClient(url, anonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null

  return publicClient
}

export function getTenantId(): string | null {
  return readPublicConfig().tenantId || null
}

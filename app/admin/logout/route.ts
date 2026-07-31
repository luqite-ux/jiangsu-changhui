import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, TENANT_COOKIE } from '@/lib/admin-session'
import { createAdminClient } from '@/lib/supabase/server'

async function logout(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (token) {
    try {
      const { error } = await createAdminClient()
        .from('admin_user_sessions')
        .delete()
        .eq('token', token)
      if (error) {
        console.error('[admin logout] failed to revoke database session')
      }
    } catch {
      console.error('[admin logout] database session revocation threw')
    }
  }

  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303)
  const clearCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  }

  response.cookies.set(SESSION_COOKIE, '', clearCookie)
  response.cookies.set(TENANT_COOKIE, '', clearCookie)
  return response
}

export async function POST(request: NextRequest) {
  return logout(request)
}

export async function GET(request: NextRequest) {
  return logout(request)
}

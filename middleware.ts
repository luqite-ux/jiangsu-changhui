import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicAdminPath =
    pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')

  if (
    pathname.startsWith('/admin') &&
    !isPublicAdminPath &&
    !request.cookies.get(SESSION_COOKIE)?.value
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('reason', 'unauthorized')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

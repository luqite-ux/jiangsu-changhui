import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
import { isPublicAdminPath } from '@/lib/admin-paths'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicAdminPathname = isPublicAdminPath(pathname)

  if (
    pathname.startsWith('/admin') &&
    !isPublicAdminPathname &&
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

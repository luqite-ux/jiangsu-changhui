function isPathOrDescendant(pathname: string, basePath: string): boolean {
  return pathname === basePath || pathname.startsWith(`${basePath}/`)
}

export function isPublicAdminPath(pathname: string): boolean {
  return (
    isPathOrDescendant(pathname, '/admin/login') ||
    isPathOrDescendant(pathname, '/admin/logout')
  )
}

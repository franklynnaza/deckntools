import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true'
  if (!isMaintenance) return NextResponse.next()

  const { pathname } = req.nextUrl

  // Allow assets, API routes, and the maintenance page itself
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/api') ||
    pathname === '/maintenance'
  ) {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = '/maintenance'
  return NextResponse.rewrite(url)
}

// Run middleware on all routes
export const config = {
  matcher: ['/((?!_next|static).*)'],
}
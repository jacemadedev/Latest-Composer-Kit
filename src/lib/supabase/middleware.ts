import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from './database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Authentication check
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // Rate limiting headers
  res.headers.set('X-RateLimit-Limit', '100')
  res.headers.set('X-RateLimit-Remaining', '100') // This should be calculated

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth related paths
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt, updateSession } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                    req.nextUrl.pathname.startsWith('/register')
  const isPublicPage = req.nextUrl.pathname === '/'

  if (!session) {
    if (!isAuthPage && !isPublicPage) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  try {
    const payload = await decrypt(session)
    const isExpired = new Date(payload.expires as string) < new Date()

    if (isExpired) {
      if (!isAuthPage && !isPublicPage) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        const res = NextResponse.redirect(url)
        res.cookies.delete('session')
        return res
      }
    }

    if (isAuthPage) {
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return await updateSession(req) || NextResponse.next()
  } catch (error) {
    if (!isAuthPage && !isPublicPage) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      const res = NextResponse.redirect(url)
      res.cookies.delete('session')
      return res
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
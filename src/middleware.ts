import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (
      path.startsWith('/dashboard/jobs/new') ||
      path.startsWith('/dashboard/applicants')
    ) {
      if (token?.role !== 'RECRUITER') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    if (path.startsWith('/dashboard/applications')) {
      if (token?.role !== 'JOB_SEEKER') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: '/login' },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/profile/:path*',
    '/api/applications/:path*',
    '/api/ai/:path*',
  ],
}
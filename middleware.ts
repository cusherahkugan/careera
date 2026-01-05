import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Protect dashboard routes
    if (path.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Protect recruiter-only routes
    if (path.startsWith("/dashboard/jobs/new") || path.startsWith("/dashboard/applicants")) {
      if (token?.role !== "RECRUITER") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Protect job seeker-only routes
    if (path.startsWith("/dashboard/applications")) {
      if (token?.role !== "JOB_SEEKER") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/profile/:path*",
    "/api/applications/:path*",
    "/api/jobs/:path*"
  ]
}
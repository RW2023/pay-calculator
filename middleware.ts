// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  () => NextResponse.next(),
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'admin'
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/entries/:path*']
}

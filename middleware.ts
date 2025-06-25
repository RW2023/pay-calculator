import { withAuth } from 'next-auth/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export default withAuth(
function middleware (req: NextRequest) {
return NextResponse.next()
},
{
callbacks: {
authorized: ({ token }) => token?.role === 'admin'
}
}
)

export const config = { matcher: ['/admin/:path*', '/api/entries/:path*'] }

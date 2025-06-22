// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_BASIC =
  process.env.ADMIN_USER && process.env.ADMIN_PASSWORD
    ? 'Basic ' +
      Buffer.from(
        `${process.env.ADMIN_USER}:${process.env.ADMIN_PASSWORD}`
      ).toString('base64')
    : '';

export function middleware(req: NextRequest) {
  // only protect /admin and its sub-paths
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== VALID_BASIC) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
      });
    }
  }
  return NextResponse.next();
}

export const config = {
  // apply to everything under /admin
  matcher: ['/admin/:path*'],
};

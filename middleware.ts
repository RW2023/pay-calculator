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
  if (req.nextUrl.pathname === '/admin' || req.nextUrl.pathname.startsWith('/admin/')) {
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

// ✅ This ensures both /admin and /admin/* paths are protected
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

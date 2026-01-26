import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // protect /admin routes except login
  if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
    const isAuthenticated = request.cookies.get('adminAuthenticated')?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-:path*'],
};

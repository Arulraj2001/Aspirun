import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js 16: file must be named proxy.ts and export a function named "proxy"
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Tell crawlers not to index private student pages
  if (pathname.startsWith('/student')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // 2. Tell crawlers not to index admin pages
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // 3. Security headers on all pages
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. CDN cache hints for public content pages
  if (
    pathname.startsWith('/materials') ||
    pathname.startsWith('/guidance') ||
    pathname.startsWith('/current-affairs') ||
    pathname.startsWith('/mock-tests') ||
    pathname.startsWith('/study-planner') ||
    pathname.startsWith('/daily-quiz') ||
    pathname.startsWith('/community')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

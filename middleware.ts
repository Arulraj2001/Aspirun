import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  // 3. Add security headers on all pages
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. Cache static public pages for better performance
  if (
    pathname.startsWith('/materials') ||
    pathname.startsWith('/guidance') ||
    pathname.startsWith('/current-affairs') ||
    pathname.startsWith('/mock-tests') ||
    pathname.startsWith('/study-planner') ||
    pathname.startsWith('/daily-quiz') ||
    pathname.startsWith('/community')
  ) {
    // CDN cache for 60s, browser revalidate
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

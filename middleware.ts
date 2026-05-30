import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/forgotpassword',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
];

const publicPrefixes = [
  '/blog',
  '/physics',
  '/chemistry',
  '/biology',
  '/computer-science',
  '/maths',
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Exclude _next and static assets from being intercepted
  if (
    pathname.startsWith('/_next') ||
    pathname.match(/\.(.*)$/) // like favicon.ico, .png, etc.
  ) {
    return NextResponse.next();
  }

  // Allow all /api/auth routes, cron jobs, and contact form submission
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/challenges/generate') ||
    pathname.startsWith('/api/contact') ||
    pathname.startsWith('/api/blogs') ||
    pathname.startsWith('/api/admin')
  ) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('auth-token');
  const isPublicPath =
    publicPaths.includes(pathname) ||
    publicPrefixes.some(prefix =>
      pathname.startsWith(prefix)
    );

  // If user is not authenticated and trying to access a protected route
  if (!authToken && !isPublicPath) {
    // If it's an API route (other than /api/auth), return 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Save the original requested url to redirect back after login
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access login/signup pages, redirect them to home or the next path if specified
  if (authToken && (pathname === '/login' || pathname === '/signup')) {
    const nextPath = request.nextUrl.searchParams.get('next') || '/';
    const url = request.nextUrl.clone();
    // We parse the nextPath to ensure we don't redirect to an external URL or loop
    if (nextPath.startsWith('/')) {
      url.pathname = nextPath.split('?')[0];
      url.search = nextPath.split('?')[1] ? `?${nextPath.split('?')[1]}` : '';
    } else {
      url.pathname = '/';
      url.search = '';
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except _next/static, _next/image
  matcher: ['/((?!_next/static|_next/image).*)'],
};

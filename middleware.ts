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
  '/mathematics',
];

function isJwtExpired(tokenString: string): boolean {
  try {
    const parts = tokenString.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

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

  const rawCookie = request.cookies.get('auth-token')?.value;
  let hasValidAuthToken = false;
  let isExpired = false;

  if (rawCookie) {
    if (isJwtExpired(rawCookie)) {
      isExpired = true;
    } else {
      hasValidAuthToken = true;
    }
  }

  const isPublicPath =
    publicPaths.includes(pathname) ||
    publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  // If user is not authenticated and trying to access a protected route
  if (!hasValidAuthToken && !isPublicPath) {
    if (pathname.startsWith('/api/')) {
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (isExpired) res.cookies.delete('auth-token');
      return res;
    }

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname + search);
    const res = NextResponse.redirect(url);
    if (isExpired) res.cookies.delete('auth-token');
    return res;
  }

  // If user has a valid authenticated token and tries to access login/signup
  if (hasValidAuthToken && (pathname === '/login' || pathname === '/signup')) {
    const nextPath = request.nextUrl.searchParams.get('next') || '/';
    const url = request.nextUrl.clone();
    if (nextPath.startsWith('/') && !nextPath.startsWith('/login') && !nextPath.startsWith('/signup')) {
      url.pathname = nextPath.split('?')[0];
      url.search = nextPath.split('?')[1] ? `?${nextPath.split('?')[1]}` : '';
    } else {
      url.pathname = '/';
      url.search = '';
    }
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  if (isExpired) {
    response.cookies.delete('auth-token');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

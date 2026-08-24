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
  '/403',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt',
];

const publicPrefixes = [
  '/blog',
  '/physics',
  '/chemistry',
  '/biology',
  '/computer-science',
  '/mathematics',
];

function decodeJwtPayload(tokenString: string): any {
  try {
    const parts = tokenString.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isJwtExpired(payload: any): boolean {
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Exclude _next and static assets from being intercepted
  if (
    pathname.startsWith('/_next') ||
    pathname.match(/\.(.*)$/) // like favicon.ico, .png, etc.
  ) {
    return NextResponse.next();
  }

  const isLocalDev =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.endsWith('.local') ||
    process.env.NODE_ENV !== 'production';

  const isAdminSubdomain =
    host.startsWith('admin.openlabs.org.in') ||
    host.startsWith('admin.localhost') ||
    host.startsWith('admin.');

  // Parse JWT token & Role
  const rawCookie = request.cookies.get('auth-token')?.value;
  const tokenPayload = rawCookie ? decodeJwtPayload(rawCookie) : null;
  let hasValidAuthToken = false;
  let isExpired = false;
  let userRole: string = 'user';

  if (tokenPayload) {
    if (isJwtExpired(tokenPayload)) {
      isExpired = true;
    } else {
      hasValidAuthToken = true;
      userRole = tokenPayload.role || 'user';
    }
  }

  const hasAdminOrModRole = userRole === 'admin' || userRole === 'moderator';

  // Allow all /api/auth routes, cron jobs, contact form submission, and public APIs
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/challenges/generate') ||
    pathname.startsWith('/api/contact') ||
    pathname.startsWith('/api/blogs')
  ) {
    return NextResponse.next();
  }

  // ── 0. ADMIN API RBAC CHECK (/api/admin/*) ───────────────────────────
  if (pathname.startsWith('/api/admin')) {
    // If request has standalone x-admin-secret header matching server secret, let backend verify
    const secretHeader = request.headers.get('x-admin-secret');
    if (secretHeader) {
      return NextResponse.next();
    }
    // If logged in with admin or moderator role, allow to API handler
    if (hasValidAuthToken && hasAdminOrModRole) {
      return NextResponse.next();
    }
    // If logged in but regular user: 403 Forbidden
    if (hasValidAuthToken && !hasAdminOrModRole) {
      return NextResponse.json(
        { error: 'Forbidden: Admin or Moderator privileges required' },
        { status: 403 }
      );
    }
    // Unauthenticated: 401
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // ── 1. SUBDOMAIN ROUTING: admin.openlabs.org.in (or admin.localhost) ──
  if (isAdminSubdomain) {
    // If route still has /admin prefix on the subdomain, redirect to clean URL
    if (pathname.startsWith('/admin')) {
      const cleanPath = pathname.replace(/^\/admin/, '') || '/';
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.pathname = cleanPath;
      return NextResponse.redirect(cleanUrl);
    }

    // If not authenticated:
    if (!hasValidAuthToken) {
      if (pathname === '/login' || pathname === '/signup') {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname + search);
      const res = NextResponse.redirect(url);
      if (isExpired) res.cookies.delete('auth-token');
      return res;
    }

    // Authenticated on admin subdomain:
    if (pathname === '/login' || pathname === '/signup') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }

    let targetPath = pathname;
    if (pathname === '/') {
      targetPath = '/admin';
    } else if (!pathname.startsWith('/admin')) {
      targetPath = `/admin${pathname}`;
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = targetPath;
    const res = NextResponse.rewrite(rewriteUrl);
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // ── 2. MAIN DOMAIN: Redirect /admin & /admin/* to Subdomain with Clean URL ─
  if (pathname.startsWith('/admin')) {
    const cleanPath = pathname.replace(/^\/admin/, '') || '/';
    let adminHost = host;

    if (host.includes('localhost')) {
      adminHost = host.replace(/^(?:admin\.)?localhost/, 'admin.localhost');
    } else if (host.includes('127.0.0.1')) {
      adminHost = host.replace(/^(?:admin\.)?127\.0\.0\.1/, 'admin.localhost');
    } else {
      adminHost = `admin.${host.replace(/^www\./, '').replace(/^admin\./, '')}`;
    }

    const proto =
      request.headers.get('x-forwarded-proto') ||
      (request.nextUrl.protocol ? request.nextUrl.protocol.replace(':', '') : isLocalDev ? 'http' : 'https');

    const targetUrl = `${proto}://${adminHost}${cleanPath}${search}`;
    return NextResponse.redirect(targetUrl);
  }

  // ── 4. STANDARD PUBLIC & PROTECTED ACCESS RULES ─────────────────────
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

  // If user is already authenticated and visits /login or /signup
  if (hasValidAuthToken && (pathname === '/login' || pathname === '/signup')) {
    const nextPath = request.nextUrl.searchParams.get('next');
    if (
      nextPath &&
      nextPath.startsWith('/') &&
      !nextPath.startsWith('//') &&
      !nextPath.startsWith('/login') &&
      !nextPath.startsWith('/signup')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = nextPath.split('?')[0];
      url.search = nextPath.split('?')[1] ? `?${nextPath.split('?')[1]}` : '';
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  if (isExpired) {
    response.cookies.delete('auth-token');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};

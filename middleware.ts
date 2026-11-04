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
  '/privacy',
  '/terms',
  '/tracks',
  '/leaderboard',
  '/403',
  '/sitemap.xml',
  '/robots.txt',
  '/ads.txt',
  '/llms.txt',
  '/llms-full.txt',
  '/labs/biology/heart-cardiac-cycle',
  '/labs/biology/mitosis-meiosis',
  '/labs/computer-science/dsa/pathfinding-astar',
];

const publicPrefixes = [
  '/blog',
  '/tracks',
  '/physics',
  '/chemistry',
  '/biology',
  '/computer-science',
  '/mathematics',
  '/embed',
];

function b64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function parseBase64UrlJson(str: string): any {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
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

/**
 * Edge-compatible cryptographic JWT signature verification using native Web Crypto API.
 * Validates HMAC-SHA256 signature, HS256 algorithm enforcement, expiration, and essential claims.
 */
async function verifyJwtInEdge(
  tokenString: string,
  secret: string
): Promise<{ valid: boolean; isExpired?: boolean; payload?: any }> {
  if (!tokenString || typeof tokenString !== 'string' || !secret) {
    return { valid: false };
  }

  const parts = tokenString.split('.');
  if (parts.length !== 3) {
    return { valid: false };
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // 1. Decode and validate header (Strict HS256 only)
  const header = parseBase64UrlJson(headerB64);
  if (!header || header.alg !== 'HS256') {
    return { valid: false };
  }

  // 2. Decode and validate payload
  const payload = parseBase64UrlJson(payloadB64);
  if (!payload || typeof payload !== 'object' || (!payload.id && !payload.sub)) {
    return { valid: false };
  }

  // Check expiration
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return { valid: false, isExpired: true, payload };
  }

  // 3. Cryptographically verify signature
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = b64UrlToBytes(signatureB64);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as any, data);

    if (!isValid) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Exclude _next, static assets, and root crawler meta files from being intercepted
  if (
    pathname === '/ads.txt' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(.*)$/) // like favicon.ico, .png, etc.
  ) {
    return NextResponse.next();
  }

  // ── 0. CANONICAL URL NORMALIZATION & TYPO AUTO-RECOVERY ──────────────
  let normalizedPath = pathname;

  // A. Lowercase canonicalization (e.g. /LABS/CHEMISTRY/FLAME-TEST -> /labs/chemistry/flame-test)
  if (normalizedPath !== normalizedPath.toLowerCase()) {
    normalizedPath = normalizedPath.toLowerCase();
  }

  // B. URL whitespace and encoded %20 cleanup
  // (e.g. /labs/computer%20-science/ai-%20problem/%20forward%20-backward -> /labs/computer-science/ai-problem/forward-backward)
  if (normalizedPath.includes('%20') || normalizedPath.includes(' ') || normalizedPath.includes('+')) {
    try {
      normalizedPath = decodeURIComponent(normalizedPath);
    } catch {}
    normalizedPath = normalizedPath.replace(/\s+/g, '').replace(/\/+/g, '/');
  }

  // C. Common typos & truncated routes auto-correction
  if (normalizedPath.includes('conputer-science')) {
    normalizedPath = normalizedPath.replace('conputer-science', 'computer-science');
  }
  if (normalizedPath.includes('/al-problem')) {
    normalizedPath = normalizedPath.replace('/al-problem', '/ai-problem');
  }
  if (normalizedPath.includes('forward-backwardrnn')) {
    normalizedPath = normalizedPath.replace('forward-backwardrnn', 'forward-backward');
  }
  if (
    normalizedPath === '/labs/computer-scien' ||
    normalizedPath === '/computer-scien' ||
    normalizedPath === '/labs/computer-science'
  ) {
    normalizedPath = '/computer-science';
  }

  // D. Subject hub redirects (/labs/<subject> -> /<subject>)
  const subjectHubRedirects: Record<string, string> = {
    '/labs/physics': '/physics',
    '/labs/chemistry': '/chemistry',
    '/labs/biology': '/biology',
    '/labs/mathematics': '/mathematics',
  };
  if (subjectHubRedirects[normalizedPath]) {
    normalizedPath = subjectHubRedirects[normalizedPath];
  }

  // If normalized path differs, redirect cleanly to canonical destination
  if (normalizedPath !== pathname) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.pathname = normalizedPath;
    return NextResponse.redirect(canonicalUrl, 308);
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

  // Cryptographically verify JWT token & Role using Web Crypto API
  const jwtSecret =
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === 'production'
      ? ''
      : process.env.DEV_JWT_SECRET || 'openlabs-dev-secret-do-not-use-in-production-min-32-chars');

  const rawCookie = request.cookies.get('auth-token')?.value;
  let authHeaderToken = '';
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    authHeaderToken = authHeader.substring(7).trim();
  }
  const tokenCandidate = rawCookie || authHeaderToken;

  let hasValidAuthToken = false;
  let isExpired = false;
  let userRole: string = 'user';
  let tokenPayload: any = null;

  if (tokenCandidate) {
    const verifyResult = await verifyJwtInEdge(tokenCandidate, jwtSecret);
    if (verifyResult.valid && verifyResult.payload) {
      hasValidAuthToken = true;
      tokenPayload = verifyResult.payload;
      userRole = tokenPayload.role || 'user';
    } else if (verifyResult.isExpired) {
      isExpired = true;
    }
  }

  const hasAdminOrModRole = userRole === 'admin' || userRole === 'moderator';

  // Allow all /api/auth routes, cron jobs, contact form submission, and public APIs
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/challenges/generate') ||
    pathname.startsWith('/api/contact') ||
    pathname.startsWith('/api/blogs') ||
    pathname.startsWith('/api/ads') ||
    pathname.startsWith('/api/v1')
  ) {
    return NextResponse.next();
  }

  // ── 0. ADMIN API RBAC CHECK (/api/admin/*) ───────────────────────────
  if (pathname.startsWith('/api/admin')) {
    // If logged in with admin or moderator role and verified signature, allow to API handler
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
    // Unauthenticated or invalid token: 401
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

  // ── 2. PRODUCTION: Redirect main domain /admin & /admin/* to Subdomain with Clean URL ─
  if (pathname.startsWith('/admin') && !isLocalDev) {
    const cleanPath = pathname.replace(/^\/admin/, '') || '/';
    const adminHost = `admin.${host.replace(/^www\./, '').replace(/^admin\./, '')}`;
    const proto =
      request.headers.get('x-forwarded-proto') ||
      (request.nextUrl.protocol ? request.nextUrl.protocol.replace(':', '') : 'https');

    const targetUrl = `${proto}://${adminHost}${cleanPath}${search}`;
    return NextResponse.redirect(targetUrl);
  }

  // ── 3. LOCAL DEV: Direct /admin access (Require Login) ─────────────────
  if (pathname.startsWith('/admin') && isLocalDev) {
    if (!hasValidAuthToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname + search);
      const res = NextResponse.redirect(url);
      if (isExpired) res.cookies.delete('auth-token');
      return res;
    }
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
  if (pathname.startsWith('/labs')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  if (isExpired) {
    response.cookies.delete('auth-token');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|ads.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};

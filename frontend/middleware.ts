import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Protected routes — require a valid access_token cookie
// ---------------------------------------------------------------------------
const PROTECTED_ROUTES = [
  '/studio',
  '/upload',
  '/research',
  '/redesign',
  '/compare',
  '/settings',
];

// Public routes — always accessible
const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Read access_token from cookie (written by tokenStorage.setTokens())
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    // Redirect to login, preserving the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists — allow through (full JWT verification happens in FastAPI)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (Next.js API routes + FastAPI proxy)
     * - _next/static / _next/image
     * - favicon.ico
     * - Public image files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico|webp)).*)',
  ],
};

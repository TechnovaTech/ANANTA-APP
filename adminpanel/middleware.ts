import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// COMPLETELY DISABLE MIDDLEWARE FOR NOW
export function middleware(request: NextRequest) {
  // Allow all requests - no authentication check
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
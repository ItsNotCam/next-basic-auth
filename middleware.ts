// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';

export function middleware(req: NextRequest) {
	console.log("validating")

  // Retrieve the 'session' cookie from the request headers
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const session = cookies.session;

  // Define paths that require authentication
  const protectedPaths = ['/protected'];

  // Check if the user is trying to access a protected route
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    // If no session is found, redirect to the login page
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // You can add more session validation logic here if necessary
  }

  // Allow the request to proceed if the path is not protected or if the user is authenticated
  return NextResponse.next();
}

export const config = {
	matcher: ['/protected/:path*'],
};

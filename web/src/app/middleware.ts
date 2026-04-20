import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('PATH:', pathname);
  console.log('TOKEN:', token);

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === '/login';
  const isDashboardPage = pathname.startsWith('/dashboard');



  // ✅ Logged in → block login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isDashboardPage && !token) {
  return NextResponse.redirect(new URL('/login', request.url));
}


  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'], // 🔥 important
};

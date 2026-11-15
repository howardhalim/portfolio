import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-cookie';
import { isAdminEnabled } from '@/lib/admin-config';

export function proxy(request: NextRequest) {
  if (!isAdminEnabled()) {
    return NextResponse.rewrite(new URL('/admin-is-disabled', request.url));
  }

  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (!request.cookies.has(ADMIN_COOKIE)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

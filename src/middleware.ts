import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const dashboardPaths = ['/dashboard'];
const adminPath = '/admin';
const authPaths = ['/login', '/signup'];

async function getPayload(token: string): Promise<{ sub?: string; role?: string } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as { sub?: string; role?: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isAuth = !!token;
  const path = req.nextUrl.pathname;

  const isDashboard = dashboardPaths.some((p) => path.startsWith(p));
  const isAdmin = path.startsWith(adminPath);
  const isAuthPage = authPaths.some((p) => path.startsWith(p));

  if ((isDashboard || isAdmin) && !isAuth) {
    const login = new URL('/login', req.url);
    login.searchParams.set('from', path);
    return NextResponse.redirect(login);
  }
  if (isAdmin && token) {
    const payload = await getPayload(token);
    if (payload?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  if (isAuthPage && isAuth) {
    const from = req.nextUrl.searchParams.get('from') || '/dashboard';
    return NextResponse.redirect(new URL(from, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};

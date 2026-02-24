import * as jose from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters');
}

const secret = new TextEncoder().encode(JWT_SECRET);
const ISSUER = 'ai-saas-starter';
const AUDIENCE = 'ai-saas-starter';
const EXPIRY = '7d';

export type JWTPayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Use in API route handlers: supports cookie or Authorization: Bearer */
export async function getSessionFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : req.cookies.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

export async function requireAuthFromRequest(req: NextRequest): Promise<JWTPayload> {
  const session = await getSessionFromRequest(req);
  if (!session) throw new UnauthorizedError();
  return session;
}

export async function requireAdmin(): Promise<JWTPayload> {
  const session = await requireAuth();
  if (session.role !== 'ADMIN') throw new ForbiddenError();
  return session;
}

export async function requireAdminFromRequest(req: NextRequest): Promise<JWTPayload> {
  const session = await requireAuthFromRequest(req);
  if (session.role !== 'ADMIN') throw new ForbiddenError();
  return session;
}

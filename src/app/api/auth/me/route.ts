import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { handleApiError, UnauthorizedError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) throw new UnauthorizedError();
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { id: true, email: true, name: true, role: true, credits: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedError();
    return Response.json(user);
  } catch (e) {
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

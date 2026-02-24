import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminFromRequest } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    await requireAdminFromRequest(req);
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        createdAt: true,
      },
    });
    const total = await prisma.user.count();
    return Response.json({ users, total });
  } catch (e) {
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

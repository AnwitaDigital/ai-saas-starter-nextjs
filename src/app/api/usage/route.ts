import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuthFromRequest } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthFromRequest(req);
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);
    const offset = Number(searchParams.get('offset')) || 0;
    const logs = await prisma.usageLog.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        action: true,
        creditsUsed: true,
        metadata: true,
        createdAt: true,
      },
    });
    const total = await prisma.usageLog.count({ where: { userId: session.sub } });
    return Response.json({ logs, total });
  } catch (e) {
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuthFromRequest } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthFromRequest(req);
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);
    const status = searchParams.get('status') || undefined;
    const jobs = await prisma.job.findMany({
      where: { userId: session.sub, ...(status ? { status: status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        status: true,
        creditsUsed: true,
        createdAt: true,
        completedAt: true,
      },
    });
    return Response.json({ jobs });
  } catch (e) {
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

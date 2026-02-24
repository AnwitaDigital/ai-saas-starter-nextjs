import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuthFromRequest } from '@/lib/auth';
import { handleApiError, NotFoundError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthFromRequest(req);
    const { id } = await params;
    const job = await prisma.job.findFirst({
      where: { id, userId: session.sub },
      select: {
        id: true,
        type: true,
        status: true,
        input: true,
        output: true,
        error: true,
        creditsUsed: true,
        createdAt: true,
        completedAt: true,
      },
    });
    if (!job) throw new NotFoundError('Job not found');
    return Response.json(job);
  } catch (e) {
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

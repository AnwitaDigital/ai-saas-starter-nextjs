import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';
import { requireAdminFromRequest } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    await requireAdminFromRequest(req);
    const [userCount, jobCount, totalCreditsUsed] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.usageLog.aggregate({ _sum: { creditsUsed: true } }),
    ]);
    const jobsByStatus = await prisma.job.groupBy({
      by: ['status'],
      _count: true,
    });
    return Response.json({
      users: userCount,
      jobs: jobCount,
      totalCreditsUsed: totalCreditsUsed._sum.creditsUsed ?? 0,
      jobsByStatus: Object.fromEntries(jobsByStatus.map((j) => [j.status, j._count])),
    });
  } catch (e) {
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

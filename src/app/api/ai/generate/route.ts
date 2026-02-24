import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuthFromRequest } from '@/lib/auth';
import { handleApiError, BadRequestError } from '@/lib/errors';
import { getCredits, getDefaultCost } from '@/lib/credits';
import { addAiJob } from '@/lib/queue';

const bodySchema = z.object({
  prompt: z.string().min(1).max(4000),
  model: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthFromRequest(req);
    const raw = await req.json();
    const { prompt, model } = bodySchema.parse(raw);
    const cost = getDefaultCost();
    const credits = await getCredits(session.sub);
    if (credits < cost) throw new BadRequestError('Insufficient credits');

    const job = await prisma.job.create({
      data: {
        userId: session.sub,
        type: 'ai_generate',
        status: 'PENDING',
        input: { prompt, model: model ?? 'gpt-4o-mini' },
      },
    });

    await addAiJob({
      userId: session.sub,
      jobId: job.id,
      prompt,
      model: model ?? undefined,
    });

    return Response.json({
      jobId: job.id,
      status: 'PENDING',
      costPerRequest: cost,
      creditsRemaining: credits,
      message: 'Job queued. Poll GET /api/jobs/[id] for status and result.',
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return Response.json({ error: e.flatten().fieldErrors }, { status: 400 });
    }
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

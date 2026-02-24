import { Job } from 'bullmq';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { deductCredits, getDefaultCost } from '@/lib/credits';
import { createAiWorker, AiJobData } from '@/lib/queue';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function processAiJob(job: Job<AiJobData>): Promise<void> {
  const { userId, jobId, prompt, model = 'gpt-4o-mini' } = job.data;
  const cost = getDefaultCost();

  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'PROCESSING' },
  });

  try {
    const creditsRemaining = await deductCredits(userId, cost, 'ai_generate', { jobId });
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    });
    const text = completion.choices[0]?.message?.content ?? '';

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        output: { text, model, usage: completion.usage },
        creditsUsed: cost,
        completedAt: new Date(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'FAILED',
        error: message,
        completedAt: new Date(),
      },
    });
    throw err;
  }
}

const worker = createAiWorker(processAiJob);

worker.on('completed', (job) => {
  console.log(`[worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] Job ${job?.id} failed:`, err?.message);
});

console.log('[worker] AI job worker started');

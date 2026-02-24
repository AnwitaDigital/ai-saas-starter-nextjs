import { Queue, Worker, Job } from 'bullmq';
import { createRedisConnection } from '@/lib/redis';

const connection = () => createRedisConnection();
const QUEUE_NAME = 'ai-generation';

export const aiQueue = new Queue(QUEUE_NAME, {
  connection: connection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 1000 },
  },
});

export type AiJobData = {
  userId: string;
  jobId: string;
  prompt: string;
  model?: string;
};

export async function addAiJob(data: AiJobData): Promise<Job<AiJobData>> {
  return aiQueue.add('generate', data, { jobId: data.jobId });
}

export function createAiWorker(
  processor: (job: Job<AiJobData>) => Promise<void>
): Worker<AiJobData> {
  return new Worker<AiJobData>(QUEUE_NAME, processor, {
    connection: connection(),
    concurrency: 5,
  });
}

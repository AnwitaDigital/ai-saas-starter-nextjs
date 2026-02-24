import { prisma } from '@/lib/db';
import { BadRequestError } from '@/lib/errors';

const DEFAULT_COST = Number(process.env.DEFAULT_CREDITS_PER_REQUEST) || 10;
const INITIAL_CREDITS = Number(process.env.INITIAL_CREDITS_FOR_NEW_USER) || 100;

export async function getCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  if (!user) throw new BadRequestError('User not found');
  return user.credits;
}

export async function deductCredits(
  userId: string,
  amount: number = DEFAULT_COST,
  action: string,
  metadata?: Record<string, unknown>
): Promise<number> {
  const updated = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, select: { credits: true } });
    if (!user) throw new BadRequestError('User not found');
    if (user.credits < amount) throw new BadRequestError('Insufficient credits');
    const [u] = await Promise.all([
      tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } },
        select: { credits: true },
      }),
      tx.usageLog.create({
        data: {
          userId,
          action,
          creditsUsed: amount,
          metadata: metadata ?? undefined,
        },
      }),
    ]);
    return u.credits;
  });
  return updated;
}

export function getDefaultCost(): number {
  return DEFAULT_COST;
}

export function getInitialCredits(): number {
  return INITIAL_CREDITS;
}

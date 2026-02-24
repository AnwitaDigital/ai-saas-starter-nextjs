import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { handleApiError, BadRequestError } from '@/lib/errors';
import { getInitialCredits } from '@/lib/credits';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const { email, password, name } = bodySchema.parse(raw);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestError('Email already registered');
    const passwordHash = await bcrypt.hash(password, 12);
    const credits = getInitialCredits();
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name ?? null, credits },
      select: { id: true, email: true, name: true, role: true, credits: true },
    });
    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return Response.json(
      { user: { id: user.id, email: user.email, name: user.name, role: user.role, credits: user.credits }, token },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return Response.json({ error: e.flatten().fieldErrors }, { status: 400 });
    }
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

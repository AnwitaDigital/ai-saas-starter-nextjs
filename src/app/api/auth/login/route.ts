import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { handleApiError, UnauthorizedError } from '@/lib/errors';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const { email, password } = bodySchema.parse(raw);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError('Invalid email or password');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid email or password');
    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
      },
      token,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return Response.json({ error: e.flatten().fieldErrors }, { status: 400 });
    }
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

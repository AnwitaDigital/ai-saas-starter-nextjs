import { NextRequest } from 'next/server';
import { getCredits } from '@/lib/credits';
import { requireAuthFromRequest } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthFromRequest(req);
    const credits = await getCredits(session.sub);
    return Response.json({ credits });
  } catch (e) {
    const { status, body } = handleApiError(e);
    return Response.json(body, { status });
  }
}

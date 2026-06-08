import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, email, request, is_anonymous } = await req.json();
  if (!name || !request) return NextResponse.json({ error: 'Name and request are required' }, { status: 400 });

  const prayer = await sql`
    INSERT INTO prayer_requests (name, email, request, is_anonymous)
    VALUES (${is_anonymous ? 'Anonymous' : name}, ${email || ''}, ${request}, ${is_anonymous || false})
    RETURNING *
  `;
  return NextResponse.json({ success: true, prayer: prayer[0] });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const prayers = await sql`SELECT * FROM prayer_requests ORDER BY created_at DESC`;
  return NextResponse.json({ prayers });
}

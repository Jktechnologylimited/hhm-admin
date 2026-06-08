import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/resend';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const existing = await sql`SELECT * FROM newsletter_subscribers WHERE email = ${email}`;
  if (existing.length > 0 && existing[0].is_active) {
    return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
  }

  if (existing.length > 0) {
    await sql`UPDATE newsletter_subscribers SET is_active = true WHERE email = ${email}`;
  } else {
    await sql`INSERT INTO newsletter_subscribers (email, name) VALUES (${email}, ${name || ''})`;
  }

  try {
    await sendWelcomeEmail(email, name || '');
  } catch (e) {
    console.error('Welcome email failed:', e);
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const subscribers = await sql`
    SELECT * FROM newsletter_subscribers WHERE is_active = true ORDER BY subscribed_at DESC
  `;
  return NextResponse.json({ subscribers, total: subscribers.length });
}

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sendDevotionEmail } from '@/lib/resend';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { devotion_id } = await req.json();

  const devotions = await sql`SELECT * FROM devotions WHERE id = ${devotion_id}`;
  if (!devotions.length) return NextResponse.json({ error: 'Devotion not found' }, { status: 404 });

  const subscribers = await sql`
    SELECT email FROM newsletter_subscribers WHERE is_active = true
  `;

  const emails = subscribers.map((s: any) => s.email as string);
  if (emails.length === 0) return NextResponse.json({ message: 'No subscribers' });

  const devotion = devotions[0];
  await sendDevotionEmail(emails, devotion as any);

  return NextResponse.json({ success: true, sent_to: emails.length });
}

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sendDevotionEmail } from '@/lib/resend';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { devotion_id, test_emails } = await req.json();

  const devotions = await sql`SELECT * FROM devotions WHERE id = ${devotion_id}`;
  if (!devotions.length) return NextResponse.json({ error: 'Devotion not found' }, { status: 404 });

  // Test mode: if test_emails is provided, send ONLY to those addresses and never
  // touch the real subscriber list. Used to verify delivery before a live send.
  const isTest = Array.isArray(test_emails) && test_emails.length > 0;

  let emails: string[];
  if (isTest) {
    emails = (test_emails as string[]).map(e => String(e).trim()).filter(Boolean);
  } else {
    const subscribers = await sql`
      SELECT email FROM newsletter_subscribers WHERE is_active = true
    `;
    emails = subscribers.map((s: any) => s.email as string);
  }
  if (emails.length === 0) return NextResponse.json({ message: 'No recipients' });

  const devotion = devotions[0];
  const result = await sendDevotionEmail(emails, devotion as any);

  if (result.errors.length) {
    console.error('Devotion send errors:', result.errors);
  }

  return NextResponse.json({
    success: result.failed === 0,
    test: isTest,
    sent_to: result.sent,
    failed: result.failed,
    total: result.total,
  });
}

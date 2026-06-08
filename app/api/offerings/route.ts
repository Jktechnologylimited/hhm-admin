import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const offerings = await sql`SELECT * FROM offerings ORDER BY created_at DESC LIMIT 200`;
  const stats = await sql`
    SELECT
      COUNT(*)::int as total_count,
      COALESCE(SUM(amount) FILTER (WHERE status='success'), 0)::numeric as total_amount,
      COUNT(*) FILTER (WHERE status='success')::int as successful_count
    FROM offerings
  `;
  return NextResponse.json({ offerings, stats: stats[0] });
}

export async function POST(req: NextRequest) {
  const { donor_name, donor_email, amount, currency, reference } = await req.json();
  if (!amount || !reference) return NextResponse.json({ error: 'Amount and reference required' }, { status: 400 });
  const offering = await sql`
    INSERT INTO offerings (donor_name, donor_email, amount, currency, reference, status)
    VALUES (${donor_name||'Anonymous'}, ${donor_email||null}, ${amount}, ${currency||'NGN'}, ${reference}, 'pending')
    RETURNING *
  `;
  return NextResponse.json({ offering: offering[0] }, { status: 201 });
}

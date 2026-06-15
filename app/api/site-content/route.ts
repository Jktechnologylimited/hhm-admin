import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM site_content`;
    const content: Record<string, string> = {};
    rows.forEach((r: any) => { content[r.key] = r.value; });
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: {} });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { updates } = await req.json(); // { key: value, key: value, ... }
  for (const [key, value] of Object.entries(updates)) {
    await sql`
      INSERT INTO site_content (key, value, updated_at)
      VALUES (${key}, ${value as string}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${value as string}, updated_at = NOW()
    `;
  }
  return NextResponse.json({ success: true });
}

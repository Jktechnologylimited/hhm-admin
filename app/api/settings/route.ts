import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

// Simple key-value settings table
async function ensureTable() {
  await sql`CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
}

export async function GET(req: NextRequest) {
  await ensureTable();
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (key) {
    const rows = await sql`SELECT value FROM site_settings WHERE key = ${key}`;
    return NextResponse.json({ value: rows[0]?.value || null });
  }
  const rows = await sql`SELECT * FROM site_settings`;
  return NextResponse.json({ settings: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureTable();
  const { key, value } = await req.json();
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
  `;
  return NextResponse.json({ success: true });
}

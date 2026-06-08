import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET() {
  const items = await sql`SELECT * FROM accomplishments ORDER BY sort_order ASC, created_at DESC`;
  return NextResponse.json({ accomplishments: items });
}
export async function POST(req: NextRequest) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { title,description,stat_number,stat_label,icon,image_url,sort_order } = await req.json();
  const a = await sql`INSERT INTO accomplishments (title,description,stat_number,stat_label,icon,image_url,sort_order) VALUES (${title},${description||null},${stat_number||null},${stat_label||null},${icon||'✅'},${image_url||null},${sort_order||0}) RETURNING *`;
  return NextResponse.json({ accomplishment: a[0] }, {status:201});
}

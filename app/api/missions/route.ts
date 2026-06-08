import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET() {
  const missions = await sql`SELECT * FROM missions ORDER BY sort_order ASC, created_at DESC`;
  return NextResponse.json({ missions });
}
export async function POST(req: NextRequest) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { title,location,country,description,image_url,status,started_at,sort_order } = await req.json();
  const m = await sql`INSERT INTO missions (title,location,country,description,image_url,status,started_at,sort_order) VALUES (${title},${location},${country||null},${description||null},${image_url||null},${status||'active'},${started_at||null},${sort_order||0}) RETURNING *`;
  return NextResponse.json({ mission: m[0] }, {status:201});
}

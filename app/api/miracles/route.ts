import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET(req: NextRequest) {
  const session = await getSession();
  let miracles;
  if (session) {
    miracles = await sql`SELECT * FROM miracles ORDER BY created_at DESC`;
  } else {
    miracles = await sql`SELECT * FROM miracles WHERE is_approved=true ORDER BY is_featured DESC, created_at DESC`;
  }
  return NextResponse.json({ miracles });
}
export async function POST(req: NextRequest) {
  const { title,story,person_name,location,image_url,submitted_by_visitor } = await req.json();
  const session = await getSession();
  const approved = session ? true : false;
  const m = await sql`INSERT INTO miracles (title,story,person_name,location,image_url,is_approved,submitted_by_visitor) VALUES (${title},${story},${person_name||null},${location||null},${image_url||null},${approved},${submitted_by_visitor||false}) RETURNING *`;
  return NextResponse.json({ miracle: m[0] }, {status:201});
}

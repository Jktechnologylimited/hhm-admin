import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET(_: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  const ev = await sql`SELECT * FROM events WHERE id=${id} AND is_published=true`;
  if (!ev.length) return NextResponse.json({ error:'Not found' },{status:404});
  return NextResponse.json({ event: ev[0] });
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; const body = await req.json();
  const ev = await sql`UPDATE events SET title=${body.title},description=${body.description},event_date=${body.event_date},end_date=${body.end_date||null},location=${body.location},is_online=${body.is_online||false},meeting_link=${body.meeting_link||null},image_url=${body.image_url||null},is_published=${body.is_published??true} WHERE id=${id} RETURNING *`;
  return NextResponse.json({ event: ev[0] });
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; await sql`DELETE FROM events WHERE id=${id}`;
  return NextResponse.json({ success:true });
}

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET(_: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  const t = await sql`SELECT * FROM trainings WHERE id=${id} AND is_published=true`;
  if (!t.length) return NextResponse.json({error:'Not found'},{status:404});
  return NextResponse.json({ training: t[0] });
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; const b = await req.json();
  const t = await sql`UPDATE trainings SET title=${b.title},description=${b.description},trainer=${b.trainer},scheduled_at=${b.scheduled_at},zoom_link=${b.zoom_link||null},zoom_password=${b.zoom_password||null},is_published=${b.is_published??true},max_attendees=${b.max_attendees||null} WHERE id=${id} RETURNING *`;
  return NextResponse.json({ training: t[0] });
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; await sql`DELETE FROM trainings WHERE id=${id}`;
  return NextResponse.json({ success:true });
}

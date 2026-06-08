import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; const b = await req.json();
  const a = await sql`UPDATE accomplishments SET title=${b.title},description=${b.description||null},stat_number=${b.stat_number||null},stat_label=${b.stat_label||null},icon=${b.icon||'✅'},image_url=${b.image_url||null} WHERE id=${id} RETURNING *`;
  return NextResponse.json({ accomplishment: a[0] });
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; await sql`DELETE FROM accomplishments WHERE id=${id}`;
  return NextResponse.json({ success:true });
}

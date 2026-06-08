import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; const b = await req.json();
  const m = await sql`UPDATE miracles SET title=${b.title},story=${b.story},person_name=${b.person_name||null},location=${b.location||null},is_approved=${b.is_approved??false},is_featured=${b.is_featured??false} WHERE id=${id} RETURNING *`;
  return NextResponse.json({ miracle: m[0] });
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; await sql`DELETE FROM miracles WHERE id=${id}`;
  return NextResponse.json({ success:true });
}

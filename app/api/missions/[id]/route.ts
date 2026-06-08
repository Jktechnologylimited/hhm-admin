import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; const b = await req.json();
  const m = await sql`UPDATE missions SET title=${b.title},location=${b.location},country=${b.country||null},description=${b.description||null},image_url=${b.image_url||null},status=${b.status||'active'} WHERE id=${id} RETURNING *`;
  return NextResponse.json({ mission: m[0] });
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { id } = await params; await sql`DELETE FROM missions WHERE id=${id}`;
  return NextResponse.json({ success:true });
}

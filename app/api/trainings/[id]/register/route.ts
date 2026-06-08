import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function POST(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  const { name, email, phone } = await req.json();
  if (!name) return NextResponse.json({error:'Name required'},{status:400});
  const training = await sql`SELECT * FROM trainings WHERE id=${id}`;
  if (!training.length) return NextResponse.json({error:'Not found'},{status:404});
  const reg = await sql`INSERT INTO training_registrations (training_id,name,email,phone) VALUES (${id},${name},${email||null},${phone||null}) RETURNING *`;
  const zoom = training[0].zoom_link;
  const pass = training[0].zoom_password;
  return NextResponse.json({ success:true, zoom_link: zoom, zoom_password: pass, registration: reg[0] });
}

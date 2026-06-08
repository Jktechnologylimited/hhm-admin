import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET() {
  const trainings = await sql`SELECT t.*, COUNT(tr.id)::int as registrations FROM trainings t LEFT JOIN training_registrations tr ON tr.training_id=t.id WHERE t.is_published=true GROUP BY t.id ORDER BY t.scheduled_at ASC`;
  return NextResponse.json({ trainings });
}
export async function POST(req: NextRequest) {
  const session = await getSession(); if (!session) return NextResponse.json({error:'Unauthorized'},{status:401});
  const { title,description,trainer,scheduled_at,zoom_link,zoom_password,is_published,max_attendees } = await req.json();
  const t = await sql`INSERT INTO trainings (title,description,trainer,scheduled_at,zoom_link,zoom_password,is_published,max_attendees) VALUES (${title},${description},${trainer||'Evangelist Bob Edward'},${scheduled_at},${zoom_link||null},${zoom_password||null},${is_published??true},${max_attendees||null}) RETURNING *`;
  return NextResponse.json({ training: t[0] }, { status:201 });
}

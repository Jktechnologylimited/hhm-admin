import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const events = await sql`SELECT * FROM events WHERE is_published = true ORDER BY event_date ASC`;
  return NextResponse.json({ events });
}
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, description, event_date, end_date, location, is_online, meeting_link, image_url, is_published } = body;
  const event = await sql`INSERT INTO events (title,description,event_date,end_date,location,is_online,meeting_link,image_url,is_published) VALUES (${title},${description},${event_date},${end_date||null},${location},${is_online||false},${meeting_link||null},${image_url||null},${is_published??true}) RETURNING *`;
  return NextResponse.json({ event: event[0] }, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermon = await sql`SELECT * FROM sermons WHERE id = ${id} AND is_published = true`;
  if (!sermon.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ sermon: sermon[0] });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { title, speaker, description, content, video_url, audio_url, thumbnail_url, series, scripture, duration, is_published, published_at } = await req.json();
  const sermon = await sql`
    UPDATE sermons
    SET title=${title}, speaker=${speaker}, description=${description}, content=${content},
        video_url=${video_url}, audio_url=${audio_url}, thumbnail_url=${thumbnail_url},
        series=${series}, scripture=${scripture}, duration=${duration},
        is_published=${is_published}, published_at=${published_at}, updated_at=NOW()
    WHERE id=${id} RETURNING *
  `;
  if (!sermon.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ sermon: sermon[0] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await sql`DELETE FROM sermons WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

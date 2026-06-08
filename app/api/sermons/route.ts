import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = parseInt(searchParams.get('offset') || '0');
  const series = searchParams.get('series');

  let sermons;
  if (series) {
    sermons = await sql`
      SELECT * FROM sermons WHERE is_published = true AND series = ${series}
      ORDER BY published_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    sermons = await sql`
      SELECT * FROM sermons WHERE is_published = true
      ORDER BY published_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  const total = await sql`SELECT COUNT(*) FROM sermons WHERE is_published = true`;
  return NextResponse.json({ sermons, total: parseInt(total[0].count) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, speaker, description, content, video_url, audio_url, thumbnail_url, series, scripture, duration, is_published, published_at } = await req.json();

  if (!title || !speaker) {
    return NextResponse.json({ error: 'Title and speaker are required' }, { status: 400 });
  }

  const sermon = await sql`
    INSERT INTO sermons (title, speaker, description, content, video_url, audio_url, thumbnail_url, series, scripture, duration, is_published, published_at)
    VALUES (${title}, ${speaker}, ${description}, ${content}, ${video_url}, ${audio_url}, ${thumbnail_url}, ${series}, ${scripture}, ${duration}, ${is_published ?? true}, ${published_at || new Date().toISOString()})
    RETURNING *
  `;
  return NextResponse.json({ sermon: sermon[0] }, { status: 201 });
}

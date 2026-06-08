import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  const devotions = await sql`
    SELECT * FROM devotions
    WHERE is_published = true
    ORDER BY published_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const total = await sql`SELECT COUNT(*) FROM devotions WHERE is_published = true`;

  return NextResponse.json({ devotions, total: parseInt(total[0].count) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, scripture, content, author, is_published, published_at } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const devotion = await sql`
    INSERT INTO devotions (title, scripture, content, author, is_published, published_at)
    VALUES (${title}, ${scripture}, ${content}, ${author || "Heaven's Hospitality Ministries"}, ${is_published ?? true}, ${published_at || new Date().toISOString()})
    RETURNING *
  `;

  return NextResponse.json({ devotion: devotion[0] }, { status: 201 });
}

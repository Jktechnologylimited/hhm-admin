import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const devotion = await sql`SELECT * FROM devotions WHERE id = ${id} AND is_published = true`;
  if (!devotion.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ devotion: devotion[0] });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { title, scripture, content, author, is_published, published_at } = await req.json();
  const devotion = await sql`
    UPDATE devotions
    SET title = ${title}, scripture = ${scripture}, content = ${content},
        author = ${author}, is_published = ${is_published}, published_at = ${published_at},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!devotion.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ devotion: devotion[0] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await sql`DELETE FROM devotions WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

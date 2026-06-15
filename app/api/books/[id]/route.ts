import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { title, author, description, cover_url, download_url, is_featured, is_published, sort_order } = await req.json();

  if (is_featured) {
    await sql`UPDATE books SET is_featured = false WHERE id != ${id}`;
  }

  const result = await sql`
    UPDATE books SET
      title = ${title}, author = ${author || 'Evangelist Bob Edward'},
      description = ${description || null}, cover_url = ${cover_url || null},
      download_url = ${download_url}, is_featured = ${is_featured || false},
      is_published = ${is_published !== false}, sort_order = ${sort_order || 0},
      updated_at = NOW()
    WHERE id = ${id} RETURNING *
  `;
  return NextResponse.json({ book: result[0] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM books WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

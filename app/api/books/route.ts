import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const books = await sql`
    SELECT * FROM books ORDER BY is_featured DESC, sort_order ASC, created_at DESC
  `;
  return NextResponse.json({ books });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, author, description, cover_url, download_url, is_featured, is_published, sort_order } = await req.json();
  if (!title || !download_url) return NextResponse.json({ error: 'Title and download URL required' }, { status: 400 });

  // If this is featured, unfeatured all others first
  if (is_featured) {
    await sql`UPDATE books SET is_featured = false`;
  }

  const result = await sql`
    INSERT INTO books (title, author, description, cover_url, download_url, is_featured, is_published, sort_order)
    VALUES (${title}, ${author || 'Evangelist Bob Edward'}, ${description || null},
            ${cover_url || null}, ${download_url}, ${is_featured || false},
            ${is_published !== false}, ${sort_order || 0})
    RETURNING *
  `;
  return NextResponse.json({ book: result[0] }, { status: 201 });
}

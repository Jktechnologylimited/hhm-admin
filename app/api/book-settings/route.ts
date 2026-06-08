import { NextResponse } from 'next/server';
import sql from '@/lib/db';

const DEFAULTS = {
  featured_book_title: 'In the Fullness of His Blessings',
  featured_book_author: 'Evangelist Bob Edward',
  featured_book_description: "Religion told Bob Edward that suffering was his lot. At 21, God showed him the truth. Your blessings are not on the way — they are already yours in Christ Jesus.",
  featured_book_url: '/book/in-the-fullness-of-his-blessings.pdf',
  featured_book_cover_url: '/images/book-cover.jpg',
};

export async function GET() {
  try {
    const rows = await sql`
      SELECT key, value FROM site_settings
      WHERE key LIKE 'featured_book_%'
    `;
    const settings: any = { ...DEFAULTS };
    rows.forEach((r: any) => { if (r.value) settings[r.key] = r.value; });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

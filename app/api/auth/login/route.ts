import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (email !== adminEmail) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Check DB password override first, then fall back to env var
  let adminPassword = process.env.ADMIN_PASSWORD;
  try {
    const override = await sql`SELECT value FROM site_settings WHERE key = 'admin_password_override'`;
    if (override.length && override[0].value) {
      adminPassword = override[0].value;
    }
  } catch {}

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createToken({ email, role: 'admin' });
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}

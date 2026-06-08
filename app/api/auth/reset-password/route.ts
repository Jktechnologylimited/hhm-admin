import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });

  try {
    const rows = await sql`
      SELECT * FROM password_reset_tokens
      WHERE token = ${token} AND used = false AND expires_at > NOW()
    `;

    if (!rows.length) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    // Mark token as used
    await sql`UPDATE password_reset_tokens SET used = true WHERE token = ${token}`;

    // Update password in environment — since we use env vars, we return the new password
    // for the admin to update in Vercel. We can't update env vars at runtime.
    // Instead, we store it temporarily in site_settings as an override.
    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('admin_password_override', ${password}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${password}, updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Reset error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

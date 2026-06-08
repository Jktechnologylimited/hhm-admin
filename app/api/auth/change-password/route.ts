import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { current_password, new_password } = await req.json();
  if (!current_password || !new_password) return NextResponse.json({ error: 'Both fields required' }, { status: 400 });
  if (new_password.length < 8) return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });

  // Check current password against env var or override
  const override = await sql`SELECT value FROM site_settings WHERE key = 'admin_password_override'`.catch(() => []);
  const currentPw = override.length ? override[0].value : process.env.ADMIN_PASSWORD;

  if (current_password !== currentPw) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  // Save new password as override
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('admin_password_override', ${new_password}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${new_password}, updated_at = NOW()
  `;

  return NextResponse.json({ success: true });
}

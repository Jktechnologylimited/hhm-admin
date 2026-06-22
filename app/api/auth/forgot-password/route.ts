import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Heaven's Hospitality Ministries <heavens-hospitality@mail.ibiz.name.ng>";
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.heavenshospitality.org';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const adminEmail = process.env.ADMIN_EMAIL;
  let sendTo = '';

  if (email === adminEmail) {
    sendTo = adminEmail!;
  } else {
    // Check recovery email
    try {
      const rec = await sql`SELECT value FROM site_settings WHERE key = 'admin_recovery_email'`;
      if (rec.length && rec[0].value === email) {
        sendTo = adminEmail!;
      }
    } catch {}
  }

  // Always return success — don't expose whether email exists
  if (!sendTo) return NextResponse.json({ success: true });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  try {
    await sql`CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY, token VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used BOOLEAN DEFAULT false, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;
    await sql`INSERT INTO password_reset_tokens (token, email, expires_at)
      VALUES (${token}, ${sendTo}, ${expiresAt.toISOString()})`;
  } catch (e) {
    console.error('DB error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  const resetUrl = `${ADMIN_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM,
      to: sendTo,
      subject: 'HHM Admin — Password Reset Request',
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#F0F4FF;margin:0;padding:32px 16px;">
  <div style="max-width:520px;margin:0 auto;background:#0B1A2E;border-radius:10px;overflow:hidden;">
    <div style="padding:32px 28px;text-align:center;">
      <p style="color:rgba(232,76,14,0.9);font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">Heaven's Hospitality Ministries</p>
      <h2 style="color:white;margin:0 0 8px;font-size:24px;">Password Reset</h2>
      <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 28px;line-height:1.6;">
        You requested a password reset for the HHM Admin Portal. This link expires in <strong style="color:#E84C0E;">1 hour</strong>.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#C03A08,#E84C0E);color:white;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;">
        Reset Password
      </a>
      <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:16px 0 0;">If you did not request this, ignore this email.</p>
    </div>
    <div style="background:rgba(0,0,0,0.3);padding:16px 28px;text-align:center;">
      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">JKTL V2 System — support@jktl.com.ng</p>
    </div>
  </div>
</body>
</html>`,
    });
  } catch (e) {
    console.error('Email error:', e);
  }

  return NextResponse.json({ success: true });
}

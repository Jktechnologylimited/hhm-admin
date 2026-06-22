import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyUnsubToken } from '@/lib/unsubscribe';

export const runtime = 'nodejs'; // crypto requires the Node runtime, not edge

async function deactivate(email: string) {
  await sql`UPDATE newsletter_subscribers SET is_active = false WHERE LOWER(email) = ${email}`;
}

function page(title: string, message: string, status: number) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font-family:Georgia,serif;background:#F0F4FF;color:#0B1A2E;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
.card{max-width:460px;width:100%;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(11,26,46,.12);overflow:hidden;text-align:center;}
.hdr{background:linear-gradient(135deg,#0B1A2E,#1E3A5F);padding:26px;color:#fff;}
.hdr h1{margin:0;font-size:21px;}
.body{padding:28px;font-size:16px;line-height:1.7;color:#1A2A3A;}
.body a{color:#E84C0E;text-decoration:none;font-weight:bold;}</style></head>
<body><div class="card"><div class="hdr"><h1>Heaven's Hospitality Ministries</h1></div>
<div class="body">${message}</div></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

// RFC 8058 one-click: mail clients POST here. Must return 200/202 with no body.
export async function POST(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token') || '';
  const email = verifyUnsubToken(token);
  if (!email) return new NextResponse(null, { status: 400 });
  try {
    await deactivate(email);
  } catch {
    // idempotent best-effort; still acknowledge so the client marks it done
  }
  return new NextResponse(null, { status: 200 });
}

// Human clicks the footer link (GET) -> unsubscribe + show a branded confirmation.
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token') || '';
  const email = verifyUnsubToken(token);
  if (!email) {
    return page(
      'Invalid link',
      'This unsubscribe link is invalid or has expired. If you keep receiving emails, contact <a href="mailto:hospitalityheavens@gmail.com">hospitalityheavens@gmail.com</a>.',
      400
    );
  }
  try {
    await deactivate(email);
  } catch {
    // best-effort
  }
  return page(
    'Unsubscribed',
    `You've been unsubscribed and will no longer receive our devotions.<br><br>Changed your mind? You can resubscribe anytime at <a href="https://heavenshospitality.org">heavenshospitality.org</a>.`,
    200
  );
}

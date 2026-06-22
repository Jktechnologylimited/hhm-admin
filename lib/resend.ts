import { Resend } from 'resend';
import { unsubscribeUrl } from './unsubscribe';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Heaven's Hospitality Ministries <heavens-hospitality@mail.ibiz.name.ng>"; // Display name + address — update domain when heavenshospitality.org propagates
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://heavenshospitality.org';

// ─── Newsletter devotion email ──────────────────────────────────────────────
export async function sendDevotionEmail(
  subscribers: string[],
  devotion: { title: string; scripture: string; content: string; author: string }
) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${devotion.title}</title>
  <style>
    body{font-family:Georgia,serif;background:#F0F4FF;color:#0B1A2E;margin:0;padding:0;}
    .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(11,26,46,0.12);}
    .hdr{background:linear-gradient(135deg,#0B1A2E 0%,#152744 60%,#1E3A5F 100%);padding:36px 28px;text-align:center;}
    .hdr .label{color:rgba(232,76,14,0.85);font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;margin:0 0 10px;}
    .hdr h1{color:#fff;font-size:26px;margin:0;line-height:1.25;}
    .hdr .accent{color:#E84C0E;}
    .scripture{background:#FFF4F0;border-left:4px solid #E84C0E;padding:18px 24px;margin:0;font-style:italic;color:#152744;font-size:17px;line-height:1.7;}
    .scripture .ref{font-family:Arial,sans-serif;font-size:11px;color:#E84C0E;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:6px;}
    .body{padding:28px;}
    .body p{font-size:17px;line-height:1.85;color:#1A2A3A;margin:0 0 16px;}
    .author{font-style:italic;color:#6B8CAE;font-size:15px;margin-top:24px!important;}
    .divider{height:2px;background:linear-gradient(90deg,#E84C0E,#FF6B35);border:none;margin:0 28px;}
    .cta-block{padding:24px 28px;text-align:center;background:#F5F8FF;}
    .cta{display:inline-block;background:linear-gradient(135deg,#C03A08,#E84C0E);color:#fff!important;text-decoration:none;padding:13px 32px;border-radius:6px;font-family:Arial,sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin:0 6px 10px;}
    .cta-yt{display:inline-block;background:#FF0000;color:#fff!important;text-decoration:none;padding:13px 24px;border-radius:6px;font-family:Arial,sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin:0 6px 10px;}
    .footer{background:#0B1A2E;color:rgba(255,255,255,0.5);text-align:center;padding:20px 24px;font-family:Arial,sans-serif;font-size:11px;line-height:1.8;}
    .footer a{color:#E84C0E;text-decoration:none;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <p class="label">Heaven's Hospitality Ministries — Daily Devotion</p>
      <h1><span class="accent">"</span>${devotion.title}<span class="accent">"</span></h1>
    </div>
    <div class="scripture">
      <span class="ref">Scripture</span>
      ${devotion.scripture}
    </div>
    <div class="body">
      ${devotion.content.replace(/\n/g, '<br>')}
      <p class="author">— ${devotion.author}</p>
    </div>
    <hr class="divider">
    <div class="cta-block">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#6B8CAE;margin:0 0 14px;">Continue the journey with us</p>
      <a href="${SITE_URL}/devotions" class="cta">Read More Devotions</a>
      <a href="https://www.youtube.com/@HeveansHospitality" class="cta-yt">Watch on YouTube</a>
    </div>
    <div class="footer">
      <p>Heaven's Hospitality Ministries &nbsp;|&nbsp; <a href="${SITE_URL}">heavenshospitality.org</a></p>
      <p>Questions? Email us at <a href="mailto:hospitalityheavens@gmail.com">hospitalityheavens@gmail.com</a></p>
      <p style="color:rgba(255,255,255,0.25);margin-top:10px;">You're receiving this because you subscribed to daily devotions.<br><a href="{{UNSUB_URL}}" style="color:rgba(232,76,14,0.7);">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

  // Build one message per recipient, each with its own one-click unsubscribe URL.
  const messages = subscribers.map(email => {
    const u = unsubscribeUrl(email);
    return {
      from: FROM,
      to: email,
      subject: `Daily Devotion: ${devotion.title}`,
      html: html.replace(/{{UNSUB_URL}}/g, u),
      headers: {
        'List-Unsubscribe': `<${u}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    };
  });

  // Resend rate-limits individual sends (2-5 req/s) and does NOT throw on 429 -
  // it returns an error object. Sending 22 at once silently drops most of them.
  // The Batch API sends up to 100 per request in a single call, sidestepping that.
  const CHUNK = 100;
  let sent = 0;
  const errors: unknown[] = [];

  for (let i = 0; i < messages.length; i += CHUNK) {
    const chunk = messages.slice(i, i + CHUNK);
    try {
      const { data, error } = await resend.batch.send(chunk);
      if (error) {
        errors.push(error);
      } else {
        sent += data?.data?.length ?? chunk.length;
      }
    } catch (e) {
      errors.push(e);
    }
    // throttle between batches (only matters past 100 recipients)
    if (i + CHUNK < messages.length) await new Promise(r => setTimeout(r, 600));
  }

  return { total: subscribers.length, sent, failed: subscribers.length - sent, errors };
}

// ─── Welcome email ───────────────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, name: string) {
  const firstName = name?.split(' ')[0] || 'Friend';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Welcome to Heaven's Hospitality Ministries</title>
  <style>
    body{font-family:Georgia,serif;background:#F0F4FF;color:#0B1A2E;margin:0;padding:0;}
    .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(11,26,46,0.12);}
    .hdr{background:linear-gradient(135deg,#0B1A2E 0%,#152744 60%,#1E3A5F 100%);padding:40px 28px;text-align:center;}
    .logo-ring{width:64px;height:64px;border-radius:50%;background:rgba(232,76,14,0.15);border:2px solid rgba(232,76,14,0.4);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;}
    .hdr .label{color:rgba(232,76,14,0.8);font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;margin:0 0 10px;}
    .hdr h1{color:#fff;font-size:28px;margin:0 0 8px;line-height:1.2;}
    .hdr .sub{color:rgba(255,255,255,0.6);font-size:15px;font-style:italic;margin:0;}
    .body{padding:32px 28px;}
    .body p{font-size:17px;line-height:1.85;color:#1A2A3A;margin:0 0 18px;}
    .body h2{font-size:20px;color:#0B1A2E;margin:28px 0 12px;}
    .what-list{list-style:none;padding:0;margin:0 0 24px;}
    .what-list li{font-size:16px;color:#1A2A3A;line-height:1.7;padding:8px 0;border-bottom:1px solid #F0F4FF;display:flex;align-items:flex-start;gap:10px;}
    .what-list li .dot{width:8px;height:8px;border-radius:50%;background:#E84C0E;margin-top:8px;flex-shrink:0;}
    .scripture-block{background:#FFF4F0;border-left:4px solid #E84C0E;padding:18px 22px;border-radius:0 6px 6px 0;margin:24px 0;}
    .scripture-block p{font-style:italic;font-size:18px;color:#152744;margin:0 0 8px!important;}
    .scripture-block cite{font-family:Arial,sans-serif;font-size:11px;color:#E84C0E;letter-spacing:1px;text-transform:uppercase;}
    .cta-block{text-align:center;padding:8px 0 24px;}
    .cta{display:inline-block;background:linear-gradient(135deg,#C03A08,#E84C0E);color:#fff!important;text-decoration:none;padding:15px 36px;border-radius:6px;font-family:Arial,sans-serif;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin:6px;}
    .cta-book{display:inline-block;background:#0B1A2E;color:#fff!important;text-decoration:none;padding:15px 28px;border-radius:6px;font-family:Arial,sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin:6px;}
    .social-row{text-align:center;padding:20px 28px;background:#F5F8FF;border-top:1px solid #E8EFF9;}
    .social-row p{font-family:Arial,sans-serif;font-size:12px;color:#6B8CAE;margin:0 0 12px;}
    .soc-btn{display:inline-block;padding:10px 20px;border-radius:6px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-decoration:none;margin:4px;letter-spacing:0.5px;}
    .soc-tt{background:#010101;color:#fff!important;}
    .soc-yt{background:#FF0000;color:#fff!important;}
    .footer{background:#0B1A2E;color:rgba(255,255,255,0.5);text-align:center;padding:20px 24px;font-family:Arial,sans-serif;font-size:11px;line-height:1.8;}
    .footer a{color:#E84C0E;text-decoration:none;}
  </style>
</head>
<body>
  <div class="wrap">

    <div class="hdr">
      <p class="label">Welcome to the Family</p>
      <h1>Heaven's Hospitality Ministries</h1>
      <p class="sub">We're so glad you're here, ${firstName}.</p>
    </div>

    <div class="body">
      <p>Dear ${firstName},</p>

      <p>Welcome to the Heaven's Hospitality Ministries family. By subscribing, you've joined a global community of believers who are discovering what it truly means to live in the fullness of God's love, grace, and hospitality.</p>

      <p>Evangelist Bob Edward and the entire team are honoured to walk this journey with you.</p>

      <h2>Here's what to expect:</h2>
      <ul class="what-list">
        <li><span class="dot"></span><strong>Daily Devotions</strong> — Spirit-filled reflections grounded in Scripture, delivered straight to your inbox.</li>
        <li><span class="dot"></span><strong>Sermon Updates</strong> — Be the first to know when new messages are posted from our crusades and services.</li>
        <li><span class="dot"></span><strong>Ministry News</strong> — Updates from our missions, events, and free training sessions.</li>
        <li><span class="dot"></span><strong>Prayer Coverage</strong> — You are now part of a praying community. We intercede for our subscribers regularly.</li>
      </ul>

      <div class="scripture-block">
        <p>"For I was hungry and you gave me food, I was thirsty and you gave me drink, I was a stranger and you welcomed me."</p>
        <cite>Matthew 25:35</cite>
      </div>

      <p>As a welcome gift, a free book from Evangelist Bob Edward is available to you. It is a revelation that will transform how you understand your inheritance in Christ.</p>

      <div class="cta-block">
        <a href="${SITE_URL}" class="cta">Visit Our Website</a>
        <a href="${SITE_URL}/book" class="cta-book">Download Free Book</a>
      </div>

      <p style="font-size:16px;color:#6B8CAE;font-style:italic;">If you have a prayer request, need to reach the ministry, or simply want to say hello — we are always available.</p>
      <p style="font-size:16px;color:#6B8CAE;">Email: <a href="mailto:hospitalityheavens@gmail.com" style="color:#E84C0E;">hospitalityheavens@gmail.com</a><br>
      WhatsApp: <a href="https://wa.me/27763511196" style="color:#E84C0E;">+27 763 511 196</a></p>
    </div>

    <div class="social-row">
      <p>Follow us for daily content</p>
      <a href="https://www.tiktok.com/@heavenshospitality" class="soc-btn soc-tt">TikTok @heavenshospitality</a>
      <a href="https://www.youtube.com/@HeveansHospitality" class="soc-btn soc-yt">YouTube Channel</a>
    </div>

    <div class="footer">
      <p>Heaven's Hospitality Ministries &nbsp;|&nbsp; <a href="${SITE_URL}">heavenshospitality.org</a></p>
      <p>Built with love by <a href="https://www.jktl.com.ng">JK Technology Limited</a></p>
      <p style="color:rgba(255,255,255,0.25);margin-top:8px;">You're receiving this because you subscribed at heavenshospitality.org.</p>
    </div>

  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to Heaven's Hospitality Ministries, ${firstName}!`,
    html,
  });
}

// ─── Generic send ────────────────────────────────────────────────────────────
export async function sendNewsletterEmail(to: string, subject: string, htmlContent: string) {
  try {
    const data = await resend.emails.send({ from: FROM, to, subject, html: htmlContent });
    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}


// ─── Contact notification ────────────────────────────────────────────────────
export async function sendContactNotification(message: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL || 'hospitalityheavens@gmail.com',
    replyTo: message.email,
    subject: `New Contact: ${message.subject}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#F0F4FF;margin:0;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(11,26,46,0.1);">
    <div style="background:linear-gradient(135deg,#0B1A2E,#152744);padding:28px 32px;">
      <p style="color:rgba(232,76,14,0.9);font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Heaven's Hospitality Ministries</p>
      <h2 style="color:#fff;margin:0;font-size:22px;">New Contact Message</h2>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 6px;font-size:14px;color:#6B8CAE;">From</p>
      <p style="margin:0 0 20px;font-size:16px;color:#0B1A2E;font-weight:600;">${message.name} &lt;${message.email}&gt;</p>
      <p style="margin:0 0 6px;font-size:14px;color:#6B8CAE;">Subject</p>
      <p style="margin:0 0 20px;font-size:16px;color:#0B1A2E;">${message.subject}</p>
      <p style="margin:0 0 6px;font-size:14px;color:#6B8CAE;">Message</p>
      <div style="background:#F5F8FF;border-left:4px solid #E84C0E;padding:16px 20px;border-radius:0 6px 6px 0;">
        <p style="margin:0;font-size:16px;color:#1A2A3A;line-height:1.7;">${message.message}</p>
      </div>
    </div>
    <div style="background:#0B1A2E;padding:16px 32px;text-align:center;">
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">Heaven's Hospitality Ministries — JKTL V2 System</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export default resend;

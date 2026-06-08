'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Settings {
  youtube_video_id: string;
  featured_book_title: string;
  featured_book_author: string;
  featured_book_description: string;
  featured_book_url: string;
  featured_book_cover_url: string;
}

const DEFAULTS: Settings = {
  youtube_video_id: '',
  featured_book_title: 'In the Fullness of His Blessings',
  featured_book_author: 'Evangelist Bob Edward Pepple',
  featured_book_description: 'Religion told Bob Pepple that suffering was his lot. At 21, God showed him the truth. Your blessings are not on the way — they are already yours in Christ Jesus.',
  featured_book_url: '/book/in-the-fullness-of-his-blessings.pdf',
  featured_book_cover_url: '/images/book-cover.jpg',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  // Password change
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [pwMsg, setPwMsg] = useState('');
  // Recovery email
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySaved, setRecoverySaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings?key=admin_recovery_email')
      .then(r => r.json())
      .then(d => { if (d.value) setRecoveryEmail(d.value); })
      .catch(() => {});
    // Fetch all settings at once
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          const map: any = {};
          d.settings.forEach((s: any) => { map[s.key] = s.value; });
          setSettings(prev => ({ ...prev, ...map }));
        }
      });
  }, []);

  const save = async (key: string, value: string) => {
    setSaving(key);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 3000);
  };

  const saveSection = async (keys: (keyof Settings)[]) => {
    for (const key of keys) {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: settings[key] }),
      });
    }
    setSaved('section');
    setTimeout(() => setSaved(null), 3000);
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(232,76,14,0.2)', borderRadius: 6,
    padding: '11px 14px', color: 'white',
    fontFamily: 'Cormorant Garamond,serif', fontSize: 16, outline: 'none',
  };
  const lbl: React.CSSProperties = {
    fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: 2,
    color: 'rgba(232,76,14,0.8)', textTransform: 'uppercase',
    display: 'block', marginBottom: 8,
  };
  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(232,76,14,0.12)',
    borderRadius: 10, padding: 'clamp(20px,4vw,32px)',
    marginBottom: 20,
  };

  // YouTube preview ID
  const ytPreview = (() => {
    const id = settings.youtube_video_id.trim();
    const m = id.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : id.length === 11 ? id : null;
  })();

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg('Passwords do not match'); setPwStatus('error'); return; }
    if (pwForm.newPw.length < 8) { setPwMsg('Minimum 8 characters'); setPwStatus('error'); return; }
    setPwStatus('loading'); setPwMsg('');
    const res = await fetch('/api/auth/change-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.newPw }),
    });
    const data = await res.json();
    if (res.ok) { setPwStatus('success'); setPwMsg('Password changed successfully.'); setPwForm({ current:'', newPw:'', confirm:'' }); }
    else { setPwStatus('error'); setPwMsg(data.error || 'Failed to change password'); }
  };

  const saveRecoveryEmail = async () => {
    await save('admin_recovery_email', recoveryEmail);
    setRecoverySaved(true);
    setTimeout(() => setRecoverySaved(false), 3000);
  };

  return (
    <AdminLayout title="Settings">
      <div style={{ maxWidth: 700 }}>

        {/* ── FEATURED BOOK ─────────────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, color: 'white', marginBottom: 6 }}>Featured Book</h2>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6 }}>
            This controls the book shown on the homepage and included in welcome emails. Update whenever you publish a new book — no code change needed.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={lbl}>Book Title</label>
              <input type="text" value={settings.featured_book_title}
                onChange={e => setSettings({ ...settings, featured_book_title: e.target.value })}
                style={inp} />
            </div>
            <div>
              <label style={lbl}>Author</label>
              <input type="text" value={settings.featured_book_author}
                onChange={e => setSettings({ ...settings, featured_book_author: e.target.value })}
                style={inp} />
            </div>
            <div>
              <label style={lbl}>Short Description (shown on homepage + email)</label>
              <textarea rows={3} value={settings.featured_book_description}
                onChange={e => setSettings({ ...settings, featured_book_description: e.target.value })}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} />
            </div>
            <div>
              <label style={lbl}>Download URL</label>
              <input type="text" value={settings.featured_book_url}
                onChange={e => setSettings({ ...settings, featured_book_url: e.target.value })}
                style={inp} placeholder="/book/filename.pdf  or  https://external-link.com/book.pdf" />
              <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                For a new book: add the PDF to /public/book/ and enter the path here, or paste an external download URL.
              </p>
            </div>
            <div>
              <label style={lbl}>Cover Image URL</label>
              <input type="text" value={settings.featured_book_cover_url}
                onChange={e => setSettings({ ...settings, featured_book_cover_url: e.target.value })}
                style={inp} placeholder="/images/book-cover.jpg  or  https://..." />
            </div>

            {/* Cover preview */}
            {settings.featured_book_cover_url && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={settings.featured_book_cover_url} alt="Cover preview"
                  style={{ height: 100, width: 'auto', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div>
                  <p style={{ fontFamily: 'Playfair Display,serif', fontSize: 16, color: 'white', margin: '0 0 4px' }}>{settings.featured_book_title}</p>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, color: 'rgba(232,76,14,0.7)', margin: 0 }}>{settings.featured_book_author}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => saveSection(['featured_book_title','featured_book_author','featured_book_description','featured_book_url','featured_book_cover_url'])}
            className="btn-primary" style={{ padding: '12px 24px' }}>
            {saved === 'section' ? 'Saved' : 'Save Book Settings'}
          </button>
        </div>

        {/* ── YOUTUBE VIDEO PIN ─────────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, color: 'white', marginBottom: 6 }}>Pin a YouTube Video</h2>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6 }}>
            Paste a YouTube video URL or ID. It embeds on the homepage. Leave blank to show the channel card.
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>YouTube Video URL or ID</label>
            <input type="text" value={settings.youtube_video_id}
              onChange={e => setSettings({ ...settings, youtube_video_id: e.target.value })}
              style={inp} placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx  or  xxxxxxxxxxx" />
            {ytPreview && (
              <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, color: 'rgba(100,200,100,0.7)', marginTop: 6 }}>
                Video ID: <strong>{ytPreview}</strong>
              </p>
            )}
          </div>

          {ytPreview && (
            <div style={{ marginBottom: 20, borderRadius: 8, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                src={`https://www.youtube.com/embed/${ytPreview}?rel=0&modestbranding=1`}
                title="Preview" allowFullScreen />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => save('youtube_video_id', ytPreview || settings.youtube_video_id)}
              className="btn-primary" style={{ padding: '12px 24px' }}>
              {saved === 'youtube_video_id' ? 'Saved' : 'Save'}
            </button>
            {settings.youtube_video_id && (
              <button onClick={() => { setSettings({...settings, youtube_video_id: ''}); save('youtube_video_id', ''); }}
                className="btn-outline" style={{ padding: '12px 24px' }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── EMAIL & DOMAIN STATUS ─────────────────────────────── */}
        <div style={{ ...card, borderColor: 'rgba(100,150,255,0.15)' }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: 'white', marginBottom: 16 }}>Email & Domain Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Montserrat,sans-serif', fontSize: 12 }}>
            {[
              { label: 'Sending address', value: 'heavens-hospitality@mail.ibiz.name.ng', status: 'active' },
              { label: 'Ministry email', value: 'hospitalityheavens@gmail.com', status: 'active' },
              { label: 'Domain', value: 'heavenshospitality.org', status: 'pending' },
            ].map(({ label, value, status }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: 10 }}>{label}</span>
                  <span style={{ color: 'white' }}>{value}</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 12, textTransform: 'uppercase', background: status === 'active' ? 'rgba(0,200,100,0.12)' : 'rgba(255,200,0,0.12)', color: status === 'active' ? '#4caf50' : '#ffc107' }}>
                  {status === 'active' ? 'Active' : 'Propagating'}
                </span>
              </div>
            ))}
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '8px 0 0', lineHeight: 1.6 }}>
              Once heavenshospitality.org propagates, update EMAIL_FROM in Vercel to noreply@heavenshospitality.org and verify the domain in Resend.
            </p>
          </div>
        </div>


        {/* ── CHANGE PASSWORD ─────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, color: 'white', marginBottom: 6 }}>Change Password</h2>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6 }}>
            Update your admin login password. Must be at least 8 characters.
          </p>
          <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="lbl">Current Password</label>
              <input type="password" required value={pwForm.current} onChange={e => setPwForm({...pwForm, current: e.target.value})} className="inp" placeholder="Your current password" />
            </div>
            <div>
              <label className="lbl">New Password</label>
              <input type="password" required value={pwForm.newPw} onChange={e => setPwForm({...pwForm, newPw: e.target.value})} className="inp" placeholder="Minimum 8 characters" />
            </div>
            <div>
              <label className="lbl">Confirm New Password</label>
              <input type="password" required value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} className="inp" placeholder="Repeat new password" />
            </div>
            {pwMsg && (
              <p style={{ fontSize: 12, color: pwStatus === 'success' ? '#4caf50' : '#ff8a80', marginTop: 2 }}>{pwMsg}</p>
            )}
            <button type="submit" disabled={pwStatus === 'loading'} className="btn-primary" style={{ padding: '12px 24px', width: 'fit-content' }}>
              {pwStatus === 'loading' ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* ── RECOVERY EMAIL ───────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, color: 'white', marginBottom: 6 }}>Recovery Email</h2>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6 }}>
            If you lose access to your admin email, password reset links will also be sent to this address.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="lbl">Recovery Email Address</label>
              <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)}
                className="inp" placeholder="backup@example.com" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={saveRecoveryEmail} className="btn-primary" style={{ padding: '12px 20px' }}>
                {recoverySaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, RefreshCw } from 'lucide-react';

const SECTIONS = [
  {
    section: 'Hero',
    fields: [
      { key: 'hero_headline', label: 'Main Headline', type: 'text', placeholder: "Where Heaven's Hospitality Meets the Nations", hint: 'The large headline on the homepage hero' },
      { key: 'hero_subheadline', label: 'Sub Headline', type: 'text', placeholder: 'Spreading the love and hospitality of Heaven...', hint: 'Smaller text below the main headline' },
      { key: 'hero_cta_text', label: 'Button Text', type: 'text', placeholder: 'Watch Our Ministry', hint: 'Text on the hero call-to-action button' },
    ],
  },
  {
    section: 'About',
    fields: [
      { key: 'about_headline', label: 'About Headline', type: 'text', placeholder: 'About Evangelist Bob Edward', hint: '' },
      { key: 'about_paragraph_1', label: 'First Paragraph', type: 'textarea', placeholder: 'Evangelist Bob Edward is the founder of...', hint: 'Main about text' },
      { key: 'about_paragraph_2', label: 'Second Paragraph', type: 'textarea', placeholder: 'His ministry began with...', hint: 'Additional about text' },
      { key: 'about_tagline', label: 'Tagline / Quote', type: 'text', placeholder: 'Taking the Gospel to every nation...', hint: 'Short bold tagline' },
    ],
  },
  {
    section: 'Contact',
    fields: [
      { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'hospitalityheavens@gmail.com', hint: 'Shown in the contact section and footer' },
      { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+27763511196', hint: 'International format, no spaces' },
      { key: 'contact_phone', label: 'Phone Number', type: 'text', placeholder: '+2349138688465', hint: 'Displayed as the prayer line' },
      { key: 'contact_address', label: 'Address / Location', type: 'text', placeholder: 'Global Ministry', hint: 'Optional physical address' },
    ],
  },
  {
    section: 'Social Media',
    fields: [
      { key: 'social_tiktok', label: 'TikTok Handle', type: 'text', placeholder: '@heavenshospitality', hint: 'Without the @ if preferred, e.g. heavenshospitality' },
      { key: 'social_youtube', label: 'YouTube Handle', type: 'text', placeholder: '@HeveansHospitality', hint: 'The @handle from your YouTube channel URL' },
      { key: 'social_youtube_video_id', label: 'Featured YouTube Video ID', type: 'text', placeholder: 'dQw4w9WgXcQ', hint: 'The part after watch?v= in a YouTube URL. Leave blank to show channel card.' },
    ],
  },
  {
    section: 'Newsletter',
    fields: [
      { key: 'newsletter_headline', label: 'Newsletter Headline', type: 'text', placeholder: 'Daily Devotions to Your Inbox', hint: '' },
      { key: 'newsletter_subtext', label: 'Newsletter Subtext', type: 'textarea', placeholder: 'Join thousands receiving the Word of God daily...', hint: '' },
    ],
  },
  {
    section: 'Footer',
    fields: [
      { key: 'footer_tagline', label: 'Footer Tagline', type: 'text', placeholder: 'Spreading the love and hospitality of Heaven to every nation...', hint: 'Short description shown in the footer' },
      { key: 'footer_scripture', label: 'Footer Scripture', type: 'textarea', placeholder: '"For I was hungry and you gave me food..."', hint: 'Bible verse shown at the bottom of the footer' },
      { key: 'footer_scripture_ref', label: 'Scripture Reference', type: 'text', placeholder: 'Matthew 25:35', hint: '' },
    ],
  },
];

export default function ContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(d => setContent(d.content || {}))
      .finally(() => setLoading(false));
  }, []);

  const saveSection = async (section: string, keys: string[]) => {
    setSaving(section);
    const updates: Record<string, string> = {};
    keys.forEach(k => { updates[k] = content[k] || ''; });
    await fetch('/api/site-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    setSaving(null);
    setSaved(section);
    setTimeout(() => setSaved(null), 3000);
  };

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(232,76,14,0.2)', borderRadius: 6, padding: '11px 14px', color: 'white', fontSize: 15, outline: 'none', transition: 'border-color 0.2s' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: 2, color: 'rgba(232,76,14,0.8)', textTransform: 'uppercase', marginBottom: 8 };
  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,76,14,0.12)', borderRadius: 10, padding: 'clamp(18px,3vw,28px)', marginBottom: 20 };

  if (loading) return (
    <AdminLayout title="Site Content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
        <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading content...
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Site Content">
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginBottom: 28 }}>
        Edit the text and details shown on the main website. Changes are applied immediately after saving — no redeployment needed.
      </p>

      {SECTIONS.map(({ section, fields }) => (
        <div key={section} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: 0 }}>{section}</h2>
            <button
              onClick={() => saveSection(section, fields.map(f => f.key))}
              disabled={saving === section}
              className="btn-primary"
              style={{ padding: '9px 20px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              {saving === section ? (
                <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
              ) : saved === section ? (
                <><Save size={13} /> Saved</>
              ) : (
                <><Save size={13} /> Save {section}</>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(({ key, label, type, placeholder, hint }) => (
              <div key={key}>
                <label style={lbl}>{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={content[key] || ''}
                    onChange={e => setContent({ ...content, [key]: e.target.value })}
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }}
                    placeholder={placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={content[key] || ''}
                    onChange={e => setContent({ ...content, [key]: e.target.value })}
                    style={inp}
                    placeholder={placeholder}
                  />
                )}
                {hint && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 5 }}>{hint}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
}

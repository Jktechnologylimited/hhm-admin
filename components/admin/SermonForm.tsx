'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  title: string;
  speaker: string;
  description: string;
  content: string;
  video_url: string;
  audio_url: string;
  thumbnail_url: string;
  series: string;
  scripture: string;
  duration: string;
  is_published: boolean;
  published_at: string;
}

export default function SermonForm({ initial, id }: { initial?: FormData; id?: number }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initial || {
    title: '', speaker: "Heaven's Hospitality Ministries", description: '', content: '',
    video_url: '', audio_url: '', thumbnail_url: '', series: '', scripture: '',
    duration: '', is_published: true, published_at: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const url = id ? `/api/sermons/${id}` : '/api/sermons';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) });
      if (res.ok) router.push('/admin/sermons');
      else { const data = await res.json(); setError(data.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const inputStyle = { width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(232,76,14,0.2)', borderRadius:2, padding:'12px 16px', color:'white', fontFamily:'Cormorant Garamond,serif', fontSize:17, outline:'none' };
  const labelStyle: React.CSSProperties = { fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.8)', textTransform:'uppercase', display:'block', marginBottom:8 };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth:800 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={labelStyle}>Sermon Title *</label>
          <input type="text" required value={form.title} onChange={e => setForm({...form, title:e.target.value})} style={inputStyle} placeholder="Sermon title" />
        </div>
        <div>
          <label style={labelStyle}>Speaker *</label>
          <input type="text" required value={form.speaker} onChange={e => setForm({...form, speaker:e.target.value})} style={inputStyle} placeholder="Speaker name" />
        </div>
        <div>
          <label style={labelStyle}>Series</label>
          <input type="text" value={form.series} onChange={e => setForm({...form, series:e.target.value})} style={inputStyle} placeholder="Sermon series" />
        </div>
        <div>
          <label style={labelStyle}>Scripture</label>
          <input type="text" value={form.scripture} onChange={e => setForm({...form, scripture:e.target.value})} style={inputStyle} placeholder="e.g. Romans 8:28" />
        </div>
        <div>
          <label style={labelStyle}>Duration</label>
          <input type="text" value={form.duration} onChange={e => setForm({...form, duration:e.target.value})} style={inputStyle} placeholder="e.g. 45 min" />
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={labelStyle}>Video URL (YouTube, Vimeo, etc.)</label>
          <input type="url" value={form.video_url} onChange={e => setForm({...form, video_url:e.target.value})} style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label style={labelStyle}>Audio URL</label>
          <input type="url" value={form.audio_url} onChange={e => setForm({...form, audio_url:e.target.value})} style={inputStyle} placeholder="https://..." />
        </div>
        <div>
          <label style={labelStyle}>Thumbnail URL</label>
          <input type="url" value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url:e.target.value})} style={inputStyle} placeholder="https://..." />
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} rows={4}
          style={{ ...inputStyle, resize:'vertical' }} placeholder="Brief description of the sermon" />
      </div>

      <div style={{ marginBottom:20 }}>
        <label style={labelStyle}>Sermon Notes / Transcript</label>
        <textarea value={form.content} onChange={e => setForm({...form, content:e.target.value})} rows={10}
          style={{ ...inputStyle, resize:'vertical', lineHeight:1.8 }} placeholder="Sermon notes or transcript (HTML supported)" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }}>
        <div>
          <label style={labelStyle}>Publish Date</label>
          <input type="date" value={form.published_at?.toString().split('T')[0]} onChange={e => setForm({...form, published_at:e.target.value})} style={inputStyle} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <input type="checkbox" id="pub" checked={form.is_published} onChange={e => setForm({...form, is_published:e.target.checked})} style={{ width:18, height:18 }} />
          <label htmlFor="pub" style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, color:'rgba(255,255,255,0.7)', cursor:'pointer' }}>Published</label>
        </div>
      </div>

      {error && <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, color:'#ff8a80', marginBottom:16 }}>{error}</p>}
      <div style={{ display:'flex', gap:14 }}>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : id ? 'Update Sermon' : 'Publish Sermon'}
        </button>
        <button type="button" onClick={() => router.push('/admin/sermons')} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}

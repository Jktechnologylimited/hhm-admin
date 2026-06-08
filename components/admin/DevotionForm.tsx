'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  title: string;
  scripture: string;
  content: string;
  author: string;
  is_published: boolean;
  published_at: string;
}

interface Props {
  initial?: FormData;
  id?: number;
}

export default function DevotionForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initial || {
    title: '',
    scripture: '',
    content: '',
    author: "Heaven's Hospitality Ministries",
    is_published: true,
    published_at: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const url = id ? `/api/devotions/${id}` : '/api/devotions';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/devotions');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(232,76,14,0.2)', borderRadius:2, padding:'12px 16px', color:'white', fontFamily:'Cormorant Garamond,serif', fontSize:17, outline:'none' };
  const labelStyle: React.CSSProperties = { fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.8)', textTransform:'uppercase', display:'block', marginBottom:8 };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth:800 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={labelStyle}>Title *</label>
          <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            style={inputStyle} placeholder="Devotion title" />
        </div>
        <div>
          <label style={labelStyle}>Scripture Reference</label>
          <input type="text" value={form.scripture} onChange={e => setForm({...form, scripture: e.target.value})}
            style={inputStyle} placeholder="e.g. John 3:16" />
        </div>
        <div>
          <label style={labelStyle}>Author</label>
          <input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})}
            style={inputStyle} placeholder="Author name" />
        </div>
        <div>
          <label style={labelStyle}>Publish Date</label>
          <input type="date" value={form.published_at?.toString().split('T')[0]} onChange={e => setForm({...form, published_at: e.target.value})}
            style={inputStyle} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <input type="checkbox" id="published" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})}
            style={{ width:18, height:18 }} />
          <label htmlFor="published" style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, color:'rgba(255,255,255,0.7)', cursor:'pointer' }}>Publish immediately</label>
        </div>
      </div>

      <div style={{ marginBottom:28 }}>
        <label style={labelStyle}>Content *</label>
        <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})}
          rows={16}
          style={{ ...inputStyle, resize:'vertical', lineHeight:1.8 }}
          placeholder="Write the devotion content here. You can use HTML tags for formatting, or plain text with line breaks." />
        <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:6, letterSpacing:0.5 }}>
          Supports HTML: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;, &lt;h3&gt; etc.
        </p>
      </div>

      {error && <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, color:'#ff8a80', marginBottom:16 }}>{error}</p>}

      <div style={{ display:'flex', gap:14 }}>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : id ? 'Update Devotion' : 'Publish Devotion'}
        </button>
        <button type="button" onClick={() => router.push('/admin/devotions')} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

interface Devotion {
  id: number;
  title: string;
  scripture: string;
  is_published: boolean;
  published_at: string;
  author: string;
}

export default function AdminDevotions() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevotions = () => {
    fetch('/api/devotions?limit=50')
      .then(r => r.json())
      .then(d => setDevotions(d.devotions || []))
      .finally(() => setLoading(false));
  };

  useEffect(fetchDevotions, []);

  const deleteDevtion = async (id: number) => {
    if (!confirm('Delete this devotion?')) return;
    await fetch(`/api/devotions/${id}`, { method: 'DELETE' });
    fetchDevotions();
  };

  const sendNewsletter = async (id: number) => {
    if (!confirm('Send this devotion to all subscribers?')) return;
    const res = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({devotion_id: id}),
    });
    const data = await res.json();
    alert(`Sent to ${data.sent_to || 0} subscribers!`);
  };

  return (
    <AdminLayout title=" Devotions">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <p style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:17, color:'rgba(255,255,255,0.5)' }}>
          {devotions.length} devotion{devotions.length !== 1 ? 's' : ''} total
        </p>
        <Link href="/devotions/new" className="btn-primary">New Devotion</Link>
      </div>

      {loading ? (
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic' }}>Loading…</p>
      ) : devotions.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'rgba(255,255,255,0.02)', borderRadius:4, border:'1px dashed rgba(232,76,14,0.2)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}></div>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, color:'rgba(255,255,255,0.5)', fontStyle:'italic', marginBottom:24 }}>No devotions yet</p>
          <Link href="/devotions/new" className="btn-primary">Create Your First Devotion</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {devotions.map(d => (
            <div key={d.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(232,76,14,0.12)', borderRadius:4, padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'white' }}>{d.title}</h3>
                  <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, letterSpacing:1, padding:'3px 8px', borderRadius:2, background: d.is_published ? 'rgba(0,200,100,0.15)' : 'rgba(255,200,0,0.15)', color: d.is_published ? '#4caf50' : '#ffc107', textTransform:'uppercase' }}>
                    {d.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(232,76,14,0.6)' }}>
                  {d.scripture && ` ${d.scripture} · `}
                  {new Date(d.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div style={{ display:'flex', gap:10, flexShrink:0 }}>
                <button onClick={() => sendNewsletter(d.id)} style={{ padding:'8px 14px', background:'rgba(232,76,14,0.1)', border:'1px solid rgba(232,76,14,0.3)', borderRadius:2, color:'var(--orange)', fontFamily:'Montserrat,sans-serif', fontSize:11, cursor:'pointer' }}>
                  Send
                </button>
                <Link href={`/admin/devotions/${d.id}`} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:2, color:'white', fontFamily:'Montserrat,sans-serif', fontSize:11 }}>
                  Edit
                </Link>
                <button onClick={() => deleteDevtion(d.id)} style={{ padding:'8px 14px', background:'rgba(255,0,0,0.06)', border:'1px solid rgba(255,0,0,0.2)', borderRadius:2, color:'#ff6b6b', fontFamily:'Montserrat,sans-serif', fontSize:11, cursor:'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

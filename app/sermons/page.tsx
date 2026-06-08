'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  series: string;
  scripture: string;
  duration: string;
  is_published: boolean;
  published_at: string;
}

export default function AdminSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSermons = () => {
    fetch('/api/sermons?limit=50').then(r => r.json()).then(d => setSermons(d.sermons || [])).finally(() => setLoading(false));
  };
  useEffect(fetchSermons, []);

  const deleteSermon = async (id: number) => {
    if (!confirm('Delete this sermon?')) return;
    await fetch(`/api/sermons/${id}`, { method: 'DELETE' });
    fetchSermons();
  };

  return (
    <AdminLayout title=" Sermons">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <p style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:17, color:'rgba(255,255,255,0.5)' }}>{sermons.length} sermon{sermons.length !== 1 ? 's' : ''} total</p>
        <Link href="/sermons/new" className="btn-primary">Add Sermon</Link>
      </div>

      {loading ? (
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic' }}>Loading…</p>
      ) : sermons.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'rgba(255,255,255,0.02)', borderRadius:4, border:'1px dashed rgba(232,76,14,0.2)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}></div>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, color:'rgba(255,255,255,0.5)', fontStyle:'italic', marginBottom:24 }}>No sermons yet</p>
          <Link href="/sermons/new" className="btn-primary">Add Your First Sermon</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {sermons.map(s => (
            <div key={s.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(232,76,14,0.12)', borderRadius:4, padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'white' }}>{s.title}</h3>
                  <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, letterSpacing:1, padding:'3px 8px', borderRadius:2, background: s.is_published ? 'rgba(0,200,100,0.15)' : 'rgba(255,200,0,0.15)', color: s.is_published ? '#4caf50' : '#ffc107', textTransform:'uppercase' }}>
                    {s.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(232,76,14,0.6)' }}>
                   {s.speaker}
                  {s.series && ` · ${s.series}`}
                  {s.scripture && ` ·  ${s.scripture}`}
                  {s.duration && ` ·  ${s.duration}`}
                </p>
              </div>
              <div style={{ display:'flex', gap:10, flexShrink:0 }}>
                <Link href={`/admin/sermons/${s.id}`} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:2, color:'white', fontFamily:'Montserrat,sans-serif', fontSize:11 }}>
                  Edit
                </Link>
                <button onClick={() => deleteSermon(s.id)} style={{ padding:'8px 14px', background:'rgba(255,0,0,0.06)', border:'1px solid rgba(255,0,0,0.2)', borderRadius:2, color:'#ff6b6b', fontFamily:'Montserrat,sans-serif', fontSize:11, cursor:'pointer' }}>
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

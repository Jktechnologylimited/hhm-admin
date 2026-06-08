'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Prayer {
  id: number;
  name: string;
  email: string;
  request: string;
  is_anonymous: boolean;
  created_at: string;
}

export default function AdminPrayers() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prayer').then(r=>r.json()).then(d=>setPrayers(d.prayers||[])).finally(()=>setLoading(false));
  }, []);

  return (
    <AdminLayout title=" Prayer Requests">
      <p style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:17, color:'rgba(255,255,255,0.5)', marginBottom:28 }}>
        {prayers.length} prayer request{prayers.length !== 1 ? 's' : ''}
      </p>

      {loading ? (
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic' }}>Loading…</p>
      ) : prayers.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'rgba(255,255,255,0.02)', borderRadius:4, border:'1px dashed rgba(232,76,14,0.2)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}></div>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, color:'rgba(255,255,255,0.5)', fontStyle:'italic' }}>No prayer requests yet</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {prayers.map(p => (
            <div key={p.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(232,76,14,0.12)', borderRadius:4, padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div>
                  <span style={{ fontFamily:'Playfair Display,serif', fontSize:17, color:'white' }}>{p.name}</span>
                  {p.email && <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(232,76,14,0.6)', marginLeft:12 }}>{p.email}</span>}
                  {p.is_anonymous && <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)', padding:'2px 8px', borderRadius:2, marginLeft:8, letterSpacing:1, textTransform:'uppercase' }}>Anonymous</span>}
                </div>
                <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(255,255,255,0.4)' }}>
                  {new Date(p.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </span>
              </div>
              <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:17, color:'rgba(255,255,255,0.78)', lineHeight:1.75, fontStyle:'italic', borderLeft:'2px solid rgba(232,76,14,0.3)', paddingLeft:16 }}>
                {p.request}
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Subscriber {
  id: number;
  email: string;
  name: string;
  subscribed_at: string;
  is_active: boolean;
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/newsletter').then(r=>r.json()).then(d=>setSubscribers(d.subscribers||[])).finally(()=>setLoading(false));
  }, []);

  return (
    <AdminLayout title=" Newsletter Subscribers">
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'inline-block', background:'rgba(232,76,14,0.12)', border:'1px solid rgba(232,76,14,0.3)', borderRadius:4, padding:'16px 24px' }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, color:'var(--orange)', fontWeight:700 }}>{subscribers.length}</div>
          <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, letterSpacing:1, color:'rgba(255,255,255,0.5)', textTransform:'uppercase' }}>Active Subscribers</div>
        </div>
      </div>

      {loading ? (
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic' }}>Loading…</p>
      ) : subscribers.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'rgba(255,255,255,0.02)', borderRadius:4, border:'1px dashed rgba(232,76,14,0.2)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}></div>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, color:'rgba(255,255,255,0.5)', fontStyle:'italic' }}>No subscribers yet</p>
        </div>
      ) : (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(232,76,14,0.12)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'12px 20px', borderBottom:'1px solid rgba(232,76,14,0.12)', background:'rgba(232,76,14,0.05)' }}>
            {['Name / Email', 'Subscribed', 'Status'].map(h => (
              <span key={h} style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.7)', textTransform:'uppercase' }}>{h}</span>
            ))}
          </div>
          {subscribers.map(s => (
            <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}>
              <div>
                {s.name && <div style={{ fontFamily:'Playfair Display,serif', fontSize:15, color:'white', marginBottom:2 }}>{s.name}</div>}
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, color:'rgba(255,255,255,0.6)' }}>{s.email}</div>
              </div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(255,255,255,0.5)' }}>
                {new Date(s.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div>
                <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, padding:'3px 10px', borderRadius:2, background:'rgba(0,200,100,0.15)', color:'#4caf50', letterSpacing:1, textTransform:'uppercase' }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

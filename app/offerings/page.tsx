'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Offering { id:number; donor_name:string; donor_email:string; amount:number; currency:string; reference:string; status:string; channel:string; paid_at:string; created_at:string; }
interface Stats { total_count:number; total_amount:number; successful_count:number; }

export default function AdminOfferings() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [stats, setStats] = useState<Stats>({ total_count:0, total_amount:0, successful_count:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offerings').then(r=>r.json()).then(d=>{ setOfferings(d.offerings||[]); setStats(d.stats||{}); }).finally(()=>setLoading(false));
  }, []);

  const statusColor = (s: string) => s==='success' ? '#4caf50' : s==='pending' ? '#ffc107' : '#ff6b6b';

  return (
    <AdminLayout title=" Offerings & Transactions">
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
        {[
          { label:'Total Received', value:`₦${Number(stats.total_amount||0).toLocaleString()}`, icon:'' },
          { label:'Successful', value:stats.successful_count, icon:'' },
          { label:'All Transactions', value:stats.total_count, icon:'' },
        ].map(item => (
          <div key={item.label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(232,76,14,0.15)', borderRadius:8, padding:'20px 18px' }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{item.icon}</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:'var(--orange)', fontWeight:700 }}>{loading ? '—' : item.value}</div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:1, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', marginTop:4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic' }}>Loading…</p>
      ) : offerings.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px dashed rgba(232,76,14,0.2)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}></div>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, color:'rgba(255,255,255,0.5)', fontStyle:'italic' }}>No transactions yet</p>
        </div>
      ) : (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(232,76,14,0.1)', borderRadius:8, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
              <thead>
                <tr style={{ background:'rgba(232,76,14,0.08)', borderBottom:'1px solid rgba(232,76,14,0.15)' }}>
                  {['Donor','Amount','Status','Channel','Reference','Date'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.8)', textTransform:'uppercase', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offerings.map(o => (
                  <tr key={o.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ fontFamily:'Playfair Display,serif', fontSize:14, color:'white' }}>{o.donor_name||'Anonymous'}</div>
                      {o.donor_email && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, color:'rgba(255,255,255,0.4)' }}>{o.donor_email}</div>}
                    </td>
                    <td style={{ padding:'12px 16px', fontFamily:'Playfair Display,serif', fontSize:16, color:'var(--orange)', fontWeight:700, whiteSpace:'nowrap' }}>
                      {o.currency} {Number(o.amount).toLocaleString()}
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:700, letterSpacing:1, padding:'3px 10px', borderRadius:12, background:`${statusColor(o.status)}22`, color:statusColor(o.status), textTransform:'uppercase' }}>{o.status}</span>
                    </td>
                    <td style={{ padding:'12px 16px', fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(255,255,255,0.5)' }}>{o.channel||'—'}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'Montserrat,sans-serif', fontSize:10, color:'rgba(255,255,255,0.4)', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.reference}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(255,255,255,0.5)', whiteSpace:'nowrap' }}>
                      {new Date(o.paid_at||o.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

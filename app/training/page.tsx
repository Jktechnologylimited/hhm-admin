'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminTraining() {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title:'', description:'', trainer:"Evangelist Bob Edward", scheduled_at:'', zoom_link:'', zoom_password:'', is_published:true, max_attendees:'' });
  const [saving, setSaving] = useState(false);

  const fetch_ = () => fetch('/api/trainings').then(r=>r.json()).then(d=>setItems(d.trainings||[]));
  useEffect(() => { fetch_(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/trainings/${editing.id}` : '/api/trainings';
    await fetch(url, { method: editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form,max_attendees:form.max_attendees?Number(form.max_attendees):null}) });
    setSaving(false); setShow(false); setEditing(null); fetch_();
  };

  const del = async (id:number) => { if(!confirm('Delete?')) return; await fetch(`/api/trainings/${id}`,{method:'DELETE'}); fetch_(); };

  const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(232,76,14,0.2)', borderRadius:4, padding:'11px 14px', color:'white', fontFamily:'Cormorant Garamond,serif', fontSize:16, outline:'none' };
  const lbl: React.CSSProperties = { fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.8)', textTransform:'uppercase', display:'block', marginBottom:8 };

  return (
    <AdminLayout title=" Free Training Sessions">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:16 }}>{items.length} session{items.length!==1?'s':''}</p>
        <button onClick={() => { setEditing(null); setForm({ title:'', description:'', trainer:"Evangelist Bob Edward", scheduled_at:'', zoom_link:'', zoom_password:'', is_published:true, max_attendees:'' }); setShow(true); }} className="btn-primary">New Session</button>
      </div>
      {items.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', border:'1px dashed rgba(232,76,14,0.2)', borderRadius:8 }}>
          <div style={{ fontSize:48, marginBottom:12 }}></div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic' }}>No training sessions yet</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {items.map((item:any) => (
            <div key={item.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(232,76,14,0.1)', borderRadius:6, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, color:'white', marginBottom:4 }}>{item.title}</div>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(232,76,14,0.6)' }}>
                   {new Date(item.scheduled_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                  {' · '}{item.registrations} registered
                  {item.zoom_link ? ' ·  Zoom set' : ' ·  No zoom link'}
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>{ setEditing(item); setForm({...item, scheduled_at:item.scheduled_at?.slice(0,16)||'', max_attendees:item.max_attendees||''}); setShow(true); }} style={{ padding:'7px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:'white', fontFamily:'Montserrat,sans-serif', fontSize:11, cursor:'pointer' }}>Edit</button>
                <button onClick={()=>del(item.id)} style={{ padding:'7px 14px', background:'rgba(255,0,0,0.06)', border:'1px solid rgba(255,0,0,0.15)', borderRadius:4, color:'#ff6b6b', fontFamily:'Montserrat,sans-serif', fontSize:11, cursor:'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {show && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(8,15,26,0.9)', backdropFilter:'blur(6px)' }} onClick={e=>{if(e.target===e.currentTarget)setShow(false);}}>
          <div style={{ background:'#0F1E33', border:'1px solid rgba(232,76,14,0.25)', borderRadius:12, padding:'clamp(20px,4vw,32px)', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
            <button onClick={()=>setShow(false)} style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,0.1)', border:'none', color:'white', width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:13 }}>✕</button>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:'white', marginBottom:20 }}>{editing?'Edit':'New'} Training Session</h3>
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={lbl}>Title *</label><input required type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp} /></div>
              <div><label style={lbl}>Trainer</label><input type="text" value={form.trainer} onChange={e=>setForm({...form,trainer:e.target.value})} style={inp} /></div>
              <div><label style={lbl}>Date & Time *</label><input required type="datetime-local" value={form.scheduled_at} onChange={e=>setForm({...form,scheduled_at:e.target.value})} style={inp} /></div>
              <div><label style={lbl}>Zoom Link</label><input type="url" value={form.zoom_link||''} onChange={e=>setForm({...form,zoom_link:e.target.value})} style={inp} placeholder="https://zoom.us/j/..." /></div>
              <div><label style={lbl}>Zoom Password</label><input type="text" value={form.zoom_password||''} onChange={e=>setForm({...form,zoom_password:e.target.value})} style={inp} placeholder="Optional" /></div>
              <div><label style={lbl}>Max Attendees</label><input type="number" value={form.max_attendees||''} onChange={e=>setForm({...form,max_attendees:e.target.value})} style={inp} placeholder="Leave blank for unlimited" /></div>
              <div><label style={lbl}>Description</label><textarea rows={4} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,resize:'vertical'}} /></div>
              <div style={{ display:'flex', gap:12, marginTop:4 }}>
                <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving…':'Save Session'}</button>
                <button type="button" onClick={()=>setShow(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
export default function AdminMissions() {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ title:'', location:'', country:'', description:'', image_url:'', status:'active' });
  const fetch_ = () => fetch('/api/missions').then(r=>r.json()).then((d:any)=>setItems(d.missions||[]));
  useEffect(()=>{fetch_();},[]);
  const del = async (id:number) => { if(!confirm('Delete?')) return; await fetch('/api/missions/'+id,{method:'DELETE'}); fetch_(); };
  const save = async (e:React.FormEvent) => { e.preventDefault(); const url = editing?'/api/missions/'+editing.id:'/api/missions'; await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setShow(false); setEditing(null); fetch_(); };
  const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(232,76,14,0.2)', borderRadius:4, padding:'11px 14px', color:'white', fontFamily:'Cormorant Garamond,serif', fontSize:16, outline:'none' };
  const lbl: React.CSSProperties = { fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.8)', textTransform:'uppercase', display:'block', marginBottom:8 };
  return (
    <AdminLayout title=" Ministry Missions">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:24}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',fontSize:16}}>{items.length} mission field{items.length!==1?'s':''}</p>
        <button onClick={()=>{setEditing(null);setForm({title:'',location:'',country:'',description:'',image_url:'',status:'active'});setShow(true);}} className="btn-primary">Add Mission</button>
      </div>
      {items.length===0?(<div style={{textAlign:'center',padding:'60px 0',border:'1px dashed rgba(232,76,14,0.2)',borderRadius:8}}><div style={{fontSize:48,marginBottom:12}}></div><p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic'}}>No missions yet</p></div>):(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>{items.map((item:any)=>(
          <div key={item.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(232,76,14,0.1)',borderRadius:6,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <div><div style={{fontFamily:'Playfair Display,serif',fontSize:16,color:'white',marginBottom:4}}>{item.title}</div><div style={{fontFamily:'Montserrat,sans-serif',fontSize:11,color:'rgba(232,76,14,0.6)'}}> {item.location}{item.country?`, ${item.country}`:''} · {item.status}</div></div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{setEditing(item);setForm(item);setShow(true);}} style={{padding:'7px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,color:'white',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Edit</button>
              <button onClick={()=>del(item.id)} style={{padding:'7px 14px',background:'rgba(255,0,0,0.06)',border:'1px solid rgba(255,0,0,0.15)',borderRadius:4,color:'#ff6b6b',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Delete</button>
            </div>
          </div>))}
        </div>
      )}
      {show&&(<div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(8,15,26,0.9)',backdropFilter:'blur(6px)'}} onClick={e=>{if(e.target===e.currentTarget)setShow(false);}}>
        <div style={{background:'#0F1E33',border:'1px solid rgba(232,76,14,0.25)',borderRadius:12,padding:'clamp(20px,4vw,32px)',width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto',position:'relative'}}>
          <button onClick={()=>setShow(false)} style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,0.1)',border:'none',color:'white',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:13}}>✕</button>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:22,color:'white',marginBottom:20}}>{editing?'Edit':'Add'} Mission</h3>
          <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><label style={lbl}>Title *</label><input required type="text" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} style={inp}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><label style={lbl}>Location *</label><input required type="text" value={form.location||''} onChange={e=>setForm({...form,location:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>Country</label><input type="text" value={form.country||''} onChange={e=>setForm({...form,country:e.target.value})} style={inp}/></div>
            </div>
            <div><label style={lbl}>Status</label><select value={form.status||'active'} onChange={e=>setForm({...form,status:e.target.value})} style={{...inp,cursor:'pointer'}}><option value="active">Active</option><option value="completed">Completed</option><option value="planned">Planned</option></select></div>
            <div><label style={lbl}>Description</label><textarea rows={4} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,resize:'vertical'}}/></div>
            <div><label style={lbl}>Image URL</label><input type="url" value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})} style={inp}/></div>
            <div style={{display:'flex',gap:12,marginTop:4}}><button type="submit" className="btn-primary">Save</button><button type="button" onClick={()=>setShow(false)} className="btn-outline">Cancel</button></div>
          </form>
        </div>
      </div>)}
    </AdminLayout>
  );
}

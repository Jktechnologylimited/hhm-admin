'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
export default function AdminAccomplishments() {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ title:'', description:'', stat_number:'', stat_label:'', icon:'', image_url:'' });
  const fetch_ = () => fetch('/api/accomplishments').then(r=>r.json()).then((d:any)=>setItems(d.accomplishments||[]));
  useEffect(()=>{fetch_();},[]);
  const del = async (id:number) => { if(!confirm('Delete?')) return; await fetch('/api/accomplishments/'+id,{method:'DELETE'}); fetch_(); };
  const save = async (e:React.FormEvent) => { e.preventDefault(); const url = editing?'/api/accomplishments/'+editing.id:'/api/accomplishments'; await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setShow(false); setEditing(null); fetch_(); };
  const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(232,76,14,0.2)', borderRadius:4, padding:'11px 14px', color:'white', fontFamily:'Cormorant Garamond,serif', fontSize:16, outline:'none' };
  const lbl: React.CSSProperties = { fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.8)', textTransform:'uppercase', display:'block', marginBottom:8 };
  return (
    <AdminLayout title=" Accomplishments">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:24}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',fontSize:16}}>{items.length} accomplishment{items.length!==1?'s':''}</p>
        <button onClick={()=>{setEditing(null);setForm({title:'',description:'',stat_number:'',stat_label:'',icon:'',image_url:''});setShow(true);}} className="btn-primary">Add Accomplishment</button>
      </div>
      {items.length===0?(<div style={{textAlign:'center',padding:'60px 0',border:'1px dashed rgba(232,76,14,0.2)',borderRadius:8}}><div style={{fontSize:48,marginBottom:12}}></div><p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic'}}>No accomplishments yet</p></div>):(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,280px),1fr))',gap:16}}>
          {items.map((item:any)=>(
            <div key={item.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(232,76,14,0.12)',borderRadius:8,padding:20}}>
              <div style={{fontSize:32,marginBottom:8}}>{item.icon}</div>
              {item.stat_number&&<div style={{fontFamily:'Playfair Display,serif',fontSize:28,color:'var(--orange)',fontWeight:700}}>{item.stat_number}</div>}
              {item.stat_label&&<div style={{fontFamily:'Montserrat,sans-serif',fontSize:10,letterSpacing:1,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',marginBottom:8}}>{item.stat_label}</div>}
              <div style={{fontFamily:'Playfair Display,serif',fontSize:16,color:'white',marginBottom:12}}>{item.title}</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{setEditing(item);setForm(item);setShow(true);}} style={{padding:'6px 12px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,color:'white',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Edit</button>
                <button onClick={()=>del(item.id)} style={{padding:'6px 12px',background:'rgba(255,0,0,0.06)',border:'1px solid rgba(255,0,0,0.15)',borderRadius:4,color:'#ff6b6b',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {show&&(<div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(8,15,26,0.9)',backdropFilter:'blur(6px)'}} onClick={e=>{if(e.target===e.currentTarget)setShow(false);}}>
        <div style={{background:'#0F1E33',border:'1px solid rgba(232,76,14,0.25)',borderRadius:12,padding:'clamp(20px,4vw,32px)',width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto',position:'relative'}}>
          <button onClick={()=>setShow(false)} style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,0.1)',border:'none',color:'white',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:13}}>✕</button>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:22,color:'white',marginBottom:20}}>{editing?'Edit':'Add'} Accomplishment</h3>
          <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><label style={lbl}>Title *</label><input required type="text" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} style={inp}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><label style={lbl}>Stat Number</label><input type="text" value={form.stat_number||''} onChange={e=>setForm({...form,stat_number:e.target.value})} style={inp} placeholder="e.g. 5,000+"/></div>
              <div><label style={lbl}>Stat Label</label><input type="text" value={form.stat_label||''} onChange={e=>setForm({...form,stat_label:e.target.value})} style={inp} placeholder="Lives Touched"/></div>
            </div>
            <div><label style={lbl}>Icon (emoji)</label><input type="text" value={form.icon||''} onChange={e=>setForm({...form,icon:e.target.value})} style={inp}/></div>
            <div><label style={lbl}>Description</label><textarea rows={3} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,resize:'vertical'}}/></div>
            <div><label style={lbl}>Image URL</label><input type="url" value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})} style={inp}/></div>
            <div style={{display:'flex',gap:12,marginTop:4}}><button type="submit" className="btn-primary">Save</button><button type="button" onClick={()=>setShow(false)} className="btn-outline">Cancel</button></div>
          </form>
        </div>
      </div>)}
    </AdminLayout>
  );
}

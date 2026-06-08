'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
export default function AdminMiracles() {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ title:'', story:'', person_name:'', location:'', image_url:'', is_approved:true, is_featured:false });
  const fetch_ = () => fetch('/api/miracles').then(r=>r.json()).then((d:any)=>setItems(d.miracles||[]));
  useEffect(()=>{fetch_();},[]);
  const del = async (id:number) => { if(!confirm('Delete?')) return; await fetch('/api/miracles/'+id,{method:'DELETE'}); fetch_(); };
  const save = async (e:React.FormEvent) => { e.preventDefault(); const url = editing?'/api/miracles/'+editing.id:'/api/miracles'; await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setShow(false); setEditing(null); fetch_(); };
  const approve = async (id:number, approved:boolean) => { await fetch('/api/miracles/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...items.find(i=>i.id===id),is_approved:approved})}); fetch_(); };
  const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(232,76,14,0.2)', borderRadius:4, padding:'11px 14px', color:'white', fontFamily:'Cormorant Garamond,serif', fontSize:16, outline:'none' };
  const lbl: React.CSSProperties = { fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(232,76,14,0.8)', textTransform:'uppercase', display:'block', marginBottom:8 };
  const pending = items.filter(i=>!i.is_approved);
  const approved = items.filter(i=>i.is_approved);
  return (
    <AdminLayout title=" Miracles & Testimonies">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:24}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',fontSize:16}}>{pending.length} pending · {approved.length} approved</p>
        <button onClick={()=>{setEditing(null);setForm({title:'',story:'',person_name:'',location:'',image_url:'',is_approved:true,is_featured:false});setShow(true);}} className="btn-primary">Add Miracle</button>
      </div>
      {pending.length>0&&(<div style={{marginBottom:32}}><h3 style={{fontFamily:'Playfair Display,serif',fontSize:18,color:'#ffc107',marginBottom:14}}>⏳ Pending Approval ({pending.length})</h3>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>{pending.map((item:any)=>(
          <div key={item.id} style={{background:'rgba(255,200,0,0.05)',border:'1px solid rgba(255,200,0,0.2)',borderRadius:6,padding:'16px 20px'}}>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:15,color:'white',marginBottom:4}}>{item.title}</div>
            <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:15,color:'rgba(255,255,255,0.6)',fontStyle:'italic',marginBottom:10}}>{item.story.slice(0,120)}…</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <button onClick={()=>approve(item.id,true)} style={{padding:'6px 14px',background:'rgba(0,200,100,0.15)',border:'1px solid rgba(0,200,100,0.3)',borderRadius:4,color:'#4caf50',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Approve</button>
              <button onClick={()=>{setEditing(item);setForm(item);setShow(true);}} style={{padding:'6px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,color:'white',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Edit</button>
              <button onClick={()=>del(item.id)} style={{padding:'6px 14px',background:'rgba(255,0,0,0.06)',border:'1px solid rgba(255,0,0,0.15)',borderRadius:4,color:'#ff6b6b',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Delete</button>
            </div>
          </div>))}
        </div>
      </div>)}
      {approved.length>0&&(<div><h3 style={{fontFamily:'Playfair Display,serif',fontSize:18,color:'#4caf50',marginBottom:14}}>Published ({approved.length})</h3>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>{approved.map((item:any)=>(
          <div key={item.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(232,76,14,0.1)',borderRadius:6,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <div><div style={{fontFamily:'Playfair Display,serif',fontSize:16,color:'white',marginBottom:2}}>{item.title} {item.is_featured&&''}</div><div style={{fontFamily:'Montserrat,sans-serif',fontSize:11,color:'rgba(232,76,14,0.6)'}}>{item.person_name||'Anonymous'}{item.location?` · ${item.location}`:''}</div></div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{setEditing(item);setForm(item);setShow(true);}} style={{padding:'7px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,color:'white',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Edit</button>
              <button onClick={()=>del(item.id)} style={{padding:'7px 14px',background:'rgba(255,0,0,0.06)',border:'1px solid rgba(255,0,0,0.15)',borderRadius:4,color:'#ff6b6b',fontFamily:'Montserrat,sans-serif',fontSize:11,cursor:'pointer'}}>Delete</button>
            </div>
          </div>))}
        </div>
      </div>)}
      {items.length===0&&<div style={{textAlign:'center',padding:'60px 0',border:'1px dashed rgba(232,76,14,0.2)',borderRadius:8}}><div style={{fontSize:48,marginBottom:12}}></div><p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic'}}>No testimonies yet</p></div>}
      {show&&(<div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(8,15,26,0.9)',backdropFilter:'blur(6px)'}} onClick={e=>{if(e.target===e.currentTarget)setShow(false);}}>
        <div style={{background:'#0F1E33',border:'1px solid rgba(232,76,14,0.25)',borderRadius:12,padding:'clamp(20px,4vw,32px)',width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto',position:'relative'}}>
          <button onClick={()=>setShow(false)} style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,0.1)',border:'none',color:'white',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:13}}>✕</button>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:22,color:'white',marginBottom:20}}>{editing?'Edit':'Add'} Miracle</h3>
          <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><label style={lbl}>Title *</label><input required type="text" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} style={inp}/></div>
            <div><label style={lbl}>Story *</label><textarea required rows={5} value={form.story||''} onChange={e=>setForm({...form,story:e.target.value})} style={{...inp,resize:'vertical'}}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><label style={lbl}>Person Name</label><input type="text" value={form.person_name||''} onChange={e=>setForm({...form,person_name:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>Location</label><input type="text" value={form.location||''} onChange={e=>setForm({...form,location:e.target.value})} style={inp}/></div>
            </div>
            <div><label style={lbl}>Image URL</label><input type="url" value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})} style={inp}/></div>
            <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}><input type="checkbox" checked={form.is_approved??true} onChange={e=>setForm({...form,is_approved:e.target.checked})} style={{width:16,height:16}}/><span style={{fontFamily:'Montserrat,sans-serif',fontSize:12,color:'rgba(255,255,255,0.7)'}}>Approved (visible publicly)</span></label>
            <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}><input type="checkbox" checked={form.is_featured??false} onChange={e=>setForm({...form,is_featured:e.target.checked})} style={{width:16,height:16}}/><span style={{fontFamily:'Montserrat,sans-serif',fontSize:12,color:'rgba(255,255,255,0.7)'}}>Featured </span></label>
            <div style={{display:'flex',gap:12,marginTop:4}}><button type="submit" className="btn-primary">Save</button><button type="button" onClick={()=>setShow(false)} className="btn-outline">Cancel</button></div>
          </form>
        </div>
      </div>)}
    </AdminLayout>
  );
}

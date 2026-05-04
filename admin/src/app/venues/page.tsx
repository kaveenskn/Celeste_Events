'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { CheckCircle2, XCircle, Clock, Loader2, Search, Trash2, Star, Eye, MapPin, Users } from 'lucide-react';

interface Hotel {
  _id:string; name:string; location:string; description:string;
  basePrice:number; capacity:number; images:string[]; status:string;
  rating?:number; featured?:boolean; createdAt:string;
  ownerId?:{fullName:string;email:string;businessName:string};
  rejectionNote?:string;
}

const STATUS_META: Record<string,{bg:string;text:string;border:string;label:string}> = {
  pending:  {bg:'rgba(251,191,36,0.1)', text:'#fbbf24', border:'rgba(251,191,36,0.25)', label:'Pending'},
  approved: {bg:'rgba(16,185,129,0.1)', text:'#10b981', border:'rgba(16,185,129,0.25)', label:'Live'},
  rejected: {bg:'rgba(239,68,68,0.1)',  text:'#f87171', border:'rgba(239,68,68,0.25)',  label:'Rejected'},
};

export default function AdminVenuesPage() {
  const router = useRouter();
  const [hotels, setHotels]   = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Hotel|null>(null);
  const [filter, setFilter]   = useState<'all'|'pending'|'approved'|'rejected'>('all');
  const [search, setSearch]   = useState('');
  const [actionLoad, setActionLoad] = useState(false);
  const [rejectNote, setRejectNote] = useState('Does not meet our venue quality standards.');
  const [msg, setMsg] = useState<{type:'ok'|'err';text:string}|null>(null);

  const load = async () => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/hotels');
    if (res.status === 401) { router.push('/login'); return; }
    const data = await res.json();
    setHotels(Array.isArray(data)?data:[]); setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const action = async (id:string, body:object) => {
    setActionLoad(true); setMsg(null);
    const res = await fetch(`/api/admin/hotels/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if (res.ok) { setMsg({type:'ok',text:'✓ Updated successfully.'}); load(); setSelected(h=>h?{...h,...body}:h); }
    else setMsg({type:'err',text:'Update failed.'});
    setActionLoad(false);
  };

  const del = async (id:string) => {
    if(!confirm('Delete this venue permanently?')) return;
    await fetch(`/api/admin/hotels/${id}`,{method:'DELETE'});
    setHotels(h=>h.filter(x=>x._id!==id)); setSelected(null);
  };

  const counts = { all:hotels.length, pending:hotels.filter(h=>h.status==='pending').length, approved:hotels.filter(h=>h.status==='approved').length, rejected:hotels.filter(h=>h.status==='rejected').length };
  const filtered = hotels.filter(h=>(filter==='all'||h.status===filter)&&(h.name.toLowerCase().includes(search.toLowerCase())||h.location.toLowerCase().includes(search.toLowerCase())));

  const C = { bg:'#070605',card:'#0e0c0b',border:'#1e1c1a',amber:'#d97706',muted:'#a8a29e',dim:'#57534e',green:'#10b981' };
  const inp: React.CSSProperties = { width:'100%',background:'#111110',border:`1px solid ${C.border}`,borderRadius:9,padding:'10px 13px',color:'#f5f5f4',fontSize:13,fontFamily:'inherit',outline:'none' };

  return (
    <AdminLayout>
      <div style={{ padding:'32px 36px 60px', background:C.bg, minHeight:'100vh' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}input:focus,textarea:focus{border-color:#d97706!important;outline:none}textarea{resize:vertical}.flt{border:none;cursor:pointer;font-family:inherit;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;letter-spacing:0.07em;transition:all 0.2s}`}</style>

        <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.2em',marginBottom:5 }}>VENUE MANAGEMENT</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,color:'#fafaf9',fontWeight:600,marginBottom:24 }}>All Venues</h1>

        {/* Filters */}
        <div style={{ display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center' }}>
          <div style={{ position:'relative',flex:1,minWidth:200 }}>
            <Search style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:14,height:14,color:C.dim }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search venues…" style={{ ...inp,paddingLeft:34 }}/>
          </div>
          <div style={{ display:'flex',gap:6 }}>
            {(['all','pending','approved','rejected'] as const).map(f=>(
              <button key={f} className="flt" onClick={()=>setFilter(f)}
                style={{ background:filter===f?C.amber:C.card,color:filter===f?'#0c0a09':C.muted,border:`1px solid ${filter===f?C.amber:C.border}` }}>
                {f.charAt(0).toUpperCase()+f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:selected?'1fr 380px':'1fr',gap:20 }}>
          {/* Table */}
          <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden' }}>
            {loading ? (
              <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Loader2 style={{ width:28,height:28,color:C.amber,animation:'spin 1s linear infinite' }}/></div>
            ) : filtered.length===0 ? (
              <div style={{ textAlign:'center',padding:'48px 20px',color:C.dim }}>No venues found.</div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%',borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#070605',borderBottom:`1px solid ${C.border}` }}>
                      {['Venue','Owner','Price/Cap','Status','Featured',''].map(h=>(
                        <th key={h} style={{ padding:'11px 18px',textAlign:'left',color:C.dim,fontSize:11,fontWeight:700,letterSpacing:'0.1em',whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(h=>{
                      const sm=STATUS_META[h.status]||STATUS_META.pending;
                      return(
                        <tr key={h._id} style={{ borderBottom:`1px solid ${C.border}`,cursor:'pointer',background:selected?._id===h._id?'rgba(217,119,6,0.04)':'transparent' }}
                          onClick={()=>{setSelected(selected?._id===h._id?null:h);setMsg(null);}}>
                          <td style={{ padding:'13px 18px' }}>
                            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                              {h.images?.[0]&&<img src={h.images[0]} alt="" style={{ width:38,height:30,borderRadius:6,objectFit:'cover',flexShrink:0 }}/>}
                              <div>
                                <p style={{ color:'#e7e5e4',fontWeight:700,fontSize:14 }}>{h.name}</p>
                                <p style={{ color:C.dim,fontSize:11 }}>{h.location}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'13px 18px',color:C.muted,fontSize:13 }}>{h.ownerId?.fullName||<span style={{color:C.dim,fontStyle:'italic'}}>Seeded</span>}</td>
                          <td style={{ padding:'13px 18px',color:C.muted,fontSize:12 }}>${h.basePrice.toLocaleString()} · {h.capacity} guests</td>
                          <td style={{ padding:'13px 18px' }}>
                            <span style={{ background:sm.bg,color:sm.text,border:`1px solid ${sm.border}`,borderRadius:50,padding:'3px 11px',fontSize:11,fontWeight:700 }}>{sm.label}</span>
                          </td>
                          <td style={{ padding:'13px 18px' }}>
                            {h.featured&&<Star style={{ width:14,height:14,color:C.amber,fill:C.amber }}/>}
                          </td>
                          <td style={{ padding:'13px 18px',color:C.amber,fontSize:12,fontWeight:700,whiteSpace:'nowrap' }}>Review →</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected&&(
            <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden',height:'fit-content' }}>
              <div style={{ padding:'16px 20px',borderBottom:`1px solid ${C.border}`,background:'linear-gradient(135deg,#1a0f05,#0e0c0b)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.15em' }}>VENUE REVIEW</p>
                <button onClick={()=>setSelected(null)} style={{ background:'none',border:'none',color:C.dim,cursor:'pointer',fontSize:16 }}>✕</button>
              </div>

              <div style={{ padding:'18px 20px',display:'flex',flexDirection:'column',gap:14,maxHeight:'80vh',overflowY:'auto' }}>
                {/* Image */}
                {selected.images?.[0]&&<img src={selected.images[0]} alt="" style={{ width:'100%',height:140,objectFit:'cover',borderRadius:10 }}/>}

                <div>
                  <p style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:'#fafaf9',marginBottom:4 }}>{selected.name}</p>
                  <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                    <span style={{ ...STATUS_META[selected.status],background:STATUS_META[selected.status]?.bg,color:STATUS_META[selected.status]?.text,border:`1px solid ${STATUS_META[selected.status]?.border}`,borderRadius:50,padding:'3px 10px',fontSize:11,fontWeight:700 }}>{STATUS_META[selected.status]?.label}</span>
                    {selected.featured&&<span style={{ background:'rgba(217,119,6,0.15)',color:C.amber,border:'1px solid rgba(217,119,6,0.3)',borderRadius:50,padding:'3px 10px',fontSize:11,fontWeight:700 }}>⭐ Featured</span>}
                  </div>
                </div>

                {[
                  {icon:MapPin, v:`${selected.location}`},
                  {icon:Users,  v:`Up to ${selected.capacity} guests · $${selected.basePrice.toLocaleString()} base`},
                ].map(({icon:Icon,v})=>(
                  <div key={v} style={{ display:'flex',alignItems:'center',gap:8,color:C.muted,fontSize:13 }}>
                    <Icon style={{ width:13,height:13,color:C.amber,flexShrink:0 }}/>{v}
                  </div>
                ))}

                {selected.ownerId&&(
                  <div style={{ background:'#070605',border:`1px solid ${C.border}`,borderRadius:10,padding:'11px 13px' }}>
                    <p style={{ color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.15em',marginBottom:6 }}>SUBMITTED BY</p>
                    <p style={{ color:'#e7e5e4',fontSize:13,fontWeight:600 }}>{selected.ownerId.fullName}</p>
                    <p style={{ color:C.dim,fontSize:12 }}>{selected.ownerId.email} · {selected.ownerId.businessName}</p>
                  </div>
                )}

                <div style={{ background:'#070605',border:`1px solid ${C.border}`,borderRadius:10,padding:'11px 13px' }}>
                  <p style={{ color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.15em',marginBottom:6 }}>DESCRIPTION</p>
                  <p style={{ color:C.muted,fontSize:13,lineHeight:1.7 }}>{selected.description}</p>
                </div>

                {msg&&<div style={{ background:msg.type==='ok'?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)',border:`1px solid ${msg.type==='ok'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`,borderRadius:9,padding:'10px 13px',color:msg.type==='ok'?C.green:'#f87171',fontSize:13 }}>{msg.text}</div>}

                {/* Actions */}
                <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:14,display:'flex',flexDirection:'column',gap:10 }}>

                  {selected.status!=='approved'&&(
                    <button disabled={actionLoad} onClick={()=>action(selected._id,{status:'approved'})}
                      style={{ background:C.green,color:'#0c0a09',border:'none',borderRadius:10,padding:'12px',fontWeight:900,fontSize:12,letterSpacing:'0.12em',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:7 }}>
                      {actionLoad?<Loader2 style={{width:14,height:14,animation:'spin 1s linear infinite'}}/>:<CheckCircle2 style={{width:14,height:14}}/>}
                      APPROVE — MAKE LIVE
                    </button>
                  )}

                  {selected.status==='approved'&&(
                    <div style={{ display:'flex',gap:8 }}>
                      <button disabled={actionLoad} onClick={()=>action(selected._id,{featured:!selected.featured})}
                        style={{ flex:1,background:selected.featured?'rgba(217,119,6,0.15)':C.amber,color:selected.featured?C.amber:'#0c0a09',border:`1px solid ${C.amber}`,borderRadius:10,padding:'10px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                        <Star style={{width:13,height:13,fill:selected.featured?C.amber:'none'}}/> {selected.featured?'Unfeature':'Feature'}
                      </button>
                      <button disabled={actionLoad} onClick={()=>action(selected._id,{status:'rejected',rejectionNote:'Removed by admin.'})}
                        style={{ flex:1,background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'10px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                        <XCircle style={{width:13,height:13}}/> Revoke
                      </button>
                    </div>
                  )}

                  {selected.status==='pending'&&(
                    <div>
                      <p style={{ color:C.dim,fontSize:11,fontWeight:700,letterSpacing:'0.12em',marginBottom:7 }}>REJECTION REASON</p>
                      <textarea value={rejectNote} onChange={e=>setRejectNote(e.target.value)} rows={2} style={{ ...inp,marginBottom:8 }}/>
                      <button disabled={actionLoad} onClick={()=>action(selected._id,{status:'rejected',rejectionNote:rejectNote})}
                        style={{ width:'100%',background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'11px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:7 }}>
                        <XCircle style={{width:13,height:13}}/> REJECT VENUE
                      </button>
                    </div>
                  )}

                  <button onClick={()=>del(selected._id)} style={{ background:'none',border:`1px solid ${C.border}`,borderRadius:10,padding:'10px',color:'#f87171',fontWeight:600,fontSize:12,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                    <Trash2 style={{width:13,height:13}}/> Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

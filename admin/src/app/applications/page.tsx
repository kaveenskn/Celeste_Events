'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { CheckCircle2, XCircle, Loader2, Search, FileText, User, Mail, Phone, Building2, Globe } from 'lucide-react';

interface Application { _id:string; fullName:string; email:string; phone:string; businessName:string; businessAddress:string; businessRegNumber:string; website?:string; description:string; status:'pending'|'approved'|'rejected'; rejectionReason?:string; createdAt:string; }
const SM: Record<string,{bg:string;text:string;border:string}> = {
  pending:  {bg:'rgba(251,191,36,0.1)', text:'#fbbf24', border:'rgba(251,191,36,0.25)'},
  approved: {bg:'rgba(16,185,129,0.1)', text:'#10b981', border:'rgba(16,185,129,0.25)'},
  rejected: {bg:'rgba(239,68,68,0.1)',  text:'#f87171', border:'rgba(239,68,68,0.25)'},
};

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [apps, setApps]       = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application|null>(null);
  const [filter, setFilter]   = useState<'all'|'pending'|'approved'|'rejected'>('all');
  const [search, setSearch]   = useState('');
  const [aLoad, setALoad]     = useState(false);
  const [tempPw, setTempPw]   = useState('Welcome@123');
  const [reason, setReason]   = useState('Does not meet our venue requirements.');
  const [msg, setMsg]         = useState<{type:'ok'|'err';text:string}|null>(null);

  const load = async () => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/applications');
    if(res.status===401){router.push('/login');return;}
    const data = await res.json();
    setApps(Array.isArray(data)?data:[]); setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const act = async (id:string,body:object) => {
    setALoad(true); setMsg(null);
    const res = await fetch(`/api/admin/applications/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const data = await res.json();
    if(res.ok){setMsg({type:'ok',text:body.hasOwnProperty('action')&&(body as Record<string,string>).action==='approve'?`✓ Approved. Temp password: ${data.tempPassword}`:'✓ Rejected.'});load();setSelected(s=>s?{...s,status:(body as Record<string,string>).action==='approve'?'approved':'rejected'}:s);}
    else setMsg({type:'err',text:data.error||'Failed'});
    setALoad(false);
  };

  const counts = {all:apps.length,pending:apps.filter(a=>a.status==='pending').length,approved:apps.filter(a=>a.status==='approved').length,rejected:apps.filter(a=>a.status==='rejected').length};
  const filtered = apps.filter(a=>(filter==='all'||a.status===filter)&&(a.businessName.toLowerCase().includes(search.toLowerCase())||a.email.toLowerCase().includes(search.toLowerCase())));
  const C = {bg:'#070605',card:'#0e0c0b',border:'#1e1c1a',amber:'#d97706',muted:'#a8a29e',dim:'#57534e',green:'#10b981'};
  const inp:React.CSSProperties = {width:'100%',background:'#111110',border:`1px solid ${C.border}`,borderRadius:9,padding:'10px 13px',color:'#f5f5f4',fontSize:13,fontFamily:'inherit',outline:'none'};

  return (
    <AdminLayout>
      <div style={{padding:'32px 36px 60px',background:C.bg,minHeight:'100vh'}}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}input:focus,textarea:focus{border-color:#d97706!important;outline:none}textarea{resize:vertical}.flt{border:none;cursor:pointer;font-family:inherit;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;letter-spacing:0.07em;transition:all 0.2s}`}</style>
        <p style={{color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.2em',marginBottom:5}}>OWNER APPLICATIONS</p>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:'#fafaf9',fontWeight:600,marginBottom:24}}>Venue Applications</h1>

        <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
          <div style={{position:'relative',flex:1,minWidth:200}}>
            <Search style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:14,height:14,color:C.dim}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{...inp,paddingLeft:34}}/>
          </div>
          <div style={{display:'flex',gap:6}}>
            {(['all','pending','approved','rejected'] as const).map(f=>(
              <button key={f} className="flt" onClick={()=>setFilter(f)} style={{background:filter===f?C.amber:C.card,color:filter===f?'#0c0a09':C.muted,border:`1px solid ${filter===f?C.amber:C.border}`}}>
                {f.charAt(0).toUpperCase()+f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:selected?'1fr 370px':'1fr',gap:20}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden'}}>
            {loading?<div style={{display:'flex',justifyContent:'center',padding:60}}><Loader2 style={{width:28,height:28,color:C.amber,animation:'spin 1s linear infinite'}}/></div>
            :filtered.length===0?<div style={{textAlign:'center',padding:'48px 20px',color:C.dim}}>No applications found.</div>:(
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr style={{background:'#070605',borderBottom:`1px solid ${C.border}`}}>
                    {['Business','Contact','Applied','Status',''].map(h=><th key={h} style={{padding:'11px 18px',textAlign:'left',color:C.dim,fontSize:11,fontWeight:700,letterSpacing:'0.1em',whiteSpace:'nowrap'}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{filtered.map(a=>{
                    const sc=SM[a.status]||SM.pending;
                    return <tr key={a._id} style={{borderBottom:`1px solid ${C.border}`,cursor:'pointer',background:selected?._id===a._id?'rgba(217,119,6,0.04)':'transparent'}} onClick={()=>{setSelected(selected?._id===a._id?null:a);setMsg(null);}}>
                      <td style={{padding:'13px 18px'}}><p style={{color:'#e7e5e4',fontWeight:700,fontSize:14}}>{a.businessName}</p><p style={{color:C.dim,fontSize:11}}>{a.businessRegNumber}</p></td>
                      <td style={{padding:'13px 18px'}}><p style={{color:C.muted,fontSize:13}}>{a.fullName}</p><p style={{color:C.dim,fontSize:11}}>{a.email}</p></td>
                      <td style={{padding:'13px 18px',color:C.dim,fontSize:12,whiteSpace:'nowrap'}}>{new Date(a.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}</td>
                      <td style={{padding:'13px 18px'}}><span style={{background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,borderRadius:50,padding:'3px 11px',fontSize:11,fontWeight:700}}>{a.status}</span></td>
                      <td style={{padding:'13px 18px',color:C.amber,fontSize:12,fontWeight:700}}>Review →</td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            )}
          </div>

          {selected&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden',height:'fit-content'}}>
              <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`,background:'linear-gradient(135deg,#1a0f05,#0e0c0b)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <p style={{color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.15em'}}>APPLICATION REVIEW</p>
                <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:C.dim,cursor:'pointer',fontSize:16}}>✕</button>
              </div>
              <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:13,maxHeight:'80vh',overflowY:'auto'}}>
                <div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#fafaf9',marginBottom:6}}>{selected.businessName}</p>
                  <span style={{...SM[selected.status],background:SM[selected.status]?.bg,color:SM[selected.status]?.text,border:`1px solid ${SM[selected.status]?.border}`,borderRadius:50,padding:'3px 10px',fontSize:11,fontWeight:700}}>{selected.status}</span>
                </div>
                {[{icon:User,v:selected.fullName},{icon:Mail,v:selected.email},{icon:Phone,v:selected.phone},{icon:Building2,v:selected.businessAddress},{icon:FileText,v:`Reg: ${selected.businessRegNumber}`},...(selected.website?[{icon:Globe,v:selected.website}]:[])].map(({icon:Icon,v})=>(
                  <div key={v} style={{display:'flex',alignItems:'flex-start',gap:9,color:C.muted,fontSize:13}}><Icon style={{width:13,height:13,color:C.amber,flexShrink:0,marginTop:1}}/>{v}</div>
                ))}
                <div style={{background:'#070605',border:`1px solid ${C.border}`,borderRadius:10,padding:'11px 13px'}}>
                  <p style={{color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.15em',marginBottom:6}}>VENUE DESCRIPTION</p>
                  <p style={{color:C.muted,fontSize:13,lineHeight:1.7}}>{selected.description}</p>
                </div>
                {msg&&<div style={{background:msg.type==='ok'?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)',border:`1px solid ${msg.type==='ok'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`,borderRadius:9,padding:'10px 13px',color:msg.type==='ok'?C.green:'#f87171',fontSize:13,fontWeight:600}}>{msg.text}</div>}

                {selected.status==='pending'&&(
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,display:'flex',flexDirection:'column',gap:10}}>
                    <div><p style={{color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.12em',marginBottom:7}}>TEMP PASSWORD (for approve)</p>
                      <input value={tempPw} onChange={e=>setTempPw(e.target.value)} style={inp}/>
                    </div>
                    <button disabled={aLoad} onClick={()=>act(selected._id,{action:'approve',tempPassword:tempPw})} style={{background:C.green,color:'#0c0a09',border:'none',borderRadius:10,padding:'12px',fontWeight:900,fontSize:12,letterSpacing:'0.12em',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
                      {aLoad?<Loader2 style={{width:14,height:14,animation:'spin 1s linear infinite'}}/>:<CheckCircle2 style={{width:14,height:14}}/>} APPROVE & SEND ACCESS
                    </button>
                    <div><p style={{color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.12em',marginBottom:7}}>REJECTION REASON</p>
                      <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={2} style={{...inp,marginBottom:8}}/>
                      <button disabled={aLoad} onClick={()=>act(selected._id,{action:'reject',rejectionReason:reason})} style={{width:'100%',background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'11px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
                        <XCircle style={{width:13,height:13}}/> REJECT
                      </button>
                    </div>
                  </div>
                )}
                {selected.status==='rejected'&&selected.rejectionReason&&<div style={{background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'11px 13px'}}><p style={{color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.12em',marginBottom:5}}>REJECTION REASON</p><p style={{color:'#fca5a5',fontSize:13}}>{selected.rejectionReason}</p></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2, Search, Users } from 'lucide-react';

interface Owner { _id:string; fullName:string; email:string; phone:string; businessName:string; status:string; hotels:string[]; createdAt:string; }

export default function AdminOwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/applications').then(r => { if(r.status===401){router.push('/login');return null;} return r.json(); }).then(d => { if(d) setOwners(d.filter((o: Owner) => o.status === 'approved')); setLoading(false); });
  }, [router]);

  const filtered = owners.filter(o => o.fullName.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()) || o.businessName.toLowerCase().includes(search.toLowerCase()));
  const C = { bg:'#070605',card:'#0e0c0b',border:'#1e1c1a',amber:'#d97706',muted:'#a8a29e',dim:'#57534e',green:'#10b981' };

  return (
    <AdminLayout>
      <div style={{ padding:'32px 36px 60px',background:C.bg,minHeight:'100vh' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}input:focus{border-color:#d97706!important;outline:none}`}</style>
        <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.2em',marginBottom:5 }}>PARTNERS</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,color:'#fafaf9',fontWeight:600,marginBottom:6 }}>Approved Owners</h1>
        <p style={{ color:C.dim,fontSize:13,marginBottom:24 }}>{owners.length} active venue partners</p>

        <div style={{ position:'relative',marginBottom:20,maxWidth:340 }}>
          <Search style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:14,height:14,color:C.dim }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search owners…" style={{ width:'100%',background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px 10px 34px',color:'#f5f5f4',fontSize:13,fontFamily:'inherit',outline:'none' }}/>
        </div>

        {loading ? (
          <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Loader2 style={{ width:28,height:28,color:C.amber,animation:'spin 1s linear infinite' }}/></div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:'center',padding:'48px 20px',background:C.card,border:`1px solid ${C.border}`,borderRadius:18 }}>
            <Users style={{ width:32,height:32,color:C.dim,margin:'0 auto 12px' }}/>
            <p style={{ color:C.dim }}>No approved owners yet.</p>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16 }}>
            {filtered.map(o => (
              <div key={o._id} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:'20px' }}>
                <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
                  <div style={{ width:42,height:42,borderRadius:'50%',background:'rgba(217,119,6,0.15)',border:'1px solid rgba(217,119,6,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:C.amber,flexShrink:0 }}>
                    {o.fullName[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ color:'#e7e5e4',fontWeight:700,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{o.fullName}</p>
                    <p style={{ color:C.dim,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{o.email}</p>
                  </div>
                </div>
                <p style={{ color:C.muted,fontSize:13,fontWeight:600,marginBottom:4 }}>{o.businessName}</p>
                <p style={{ color:C.dim,fontSize:12,marginBottom:10 }}>{o.phone}</p>
                <div style={{ display:'flex',justifyContent:'space-between',paddingTop:10,borderTop:`1px solid ${C.border}` }}>
                  <span style={{ color:C.dim,fontSize:12 }}>{o.hotels?.length||0} hotel{(o.hotels?.length||0)!==1?'s':''}</span>
                  <span style={{ background:`${C.green}15`,color:C.green,border:`1px solid ${C.green}33`,borderRadius:50,padding:'2px 10px',fontSize:11,fontWeight:700 }}>Approved</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2, Search, BookOpen } from 'lucide-react';

interface Booking { _id:string; guestName:string; guestEmail:string; totalPrice:number; eventDate:string; guestCount:number; status:string; hotelId:{name:string;location:string}; createdAt:string; }

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/bookings').then(r => { if(r.status===401){router.push('/login');return null;} return r.json(); }).then(d => { if(d) setBookings(d); setLoading(false); });
  }, [router]);

  const filtered = bookings.filter(b => b.guestName.toLowerCase().includes(search.toLowerCase()) || (typeof b.hotelId==='object'&&b.hotelId.name.toLowerCase().includes(search.toLowerCase())));
  const revenue = bookings.reduce((s,b)=>s+b.totalPrice,0);

  const C = { bg:'#070605',card:'#0e0c0b',border:'#1e1c1a',amber:'#d97706',muted:'#a8a29e',dim:'#57534e',green:'#10b981' };

  return (
    <AdminLayout>
      <div style={{ padding:'32px 36px 60px',background:C.bg,minHeight:'100vh' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}input:focus{border-color:#d97706!important;outline:none}`}</style>
        <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.2em',marginBottom:5 }}>RESERVATIONS</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,color:'#fafaf9',fontWeight:600,marginBottom:6 }}>All Bookings</h1>
        <p style={{ color:C.dim,fontSize:13,marginBottom:24 }}>{bookings.length} total · ${revenue.toLocaleString()} revenue</p>

        <div style={{ position:'relative',marginBottom:20,maxWidth:340 }}>
          <Search style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:14,height:14,color:C.dim }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search bookings…" style={{ width:'100%',background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px 10px 34px',color:'#f5f5f4',fontSize:13,fontFamily:'inherit',outline:'none' }}/>
        </div>

        <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden' }}>
          {loading?(
            <div style={{ display:'flex',justifyContent:'center',padding:60 }}><Loader2 style={{ width:28,height:28,color:C.amber,animation:'spin 1s linear infinite' }}/></div>
          ):filtered.length===0?(
            <div style={{ textAlign:'center',padding:'48px 20px' }}><BookOpen style={{ width:32,height:32,color:C.dim,margin:'0 auto 12px' }}/><p style={{ color:C.dim }}>No bookings found.</p></div>
          ):(
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#070605',borderBottom:`1px solid ${C.border}` }}>
                    {['Guest','Hotel','Event Date','Guests','Total','Status','Booked On'].map(h=>(
                      <th key={h} style={{ padding:'11px 18px',textAlign:'left',color:C.dim,fontSize:11,fontWeight:700,letterSpacing:'0.1em',whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b=>(
                    <tr key={b._id} style={{ borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:'13px 18px' }}>
                        <p style={{ color:'#e7e5e4',fontWeight:700,fontSize:14 }}>{b.guestName}</p>
                        <p style={{ color:C.dim,fontSize:11 }}>{b.guestEmail}</p>
                      </td>
                      <td style={{ padding:'13px 18px',color:C.muted,fontSize:13 }}>{typeof b.hotelId==='object'?b.hotelId.name:'—'}</td>
                      <td style={{ padding:'13px 18px',color:C.muted,fontSize:13,whiteSpace:'nowrap' }}>{new Date(b.eventDate).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}</td>
                      <td style={{ padding:'13px 18px',color:C.muted,fontSize:13 }}>{b.guestCount}</td>
                      <td style={{ padding:'13px 18px',color:C.amber,fontWeight:900,fontSize:15 }}>${b.totalPrice.toLocaleString()}</td>
                      <td style={{ padding:'13px 18px' }}>
                        <span style={{ background:`${C.green}15`,color:C.green,border:`1px solid ${C.green}33`,borderRadius:50,padding:'3px 10px',fontSize:11,fontWeight:700 }}>{b.status||'confirmed'}</span>
                      </td>
                      <td style={{ padding:'13px 18px',color:C.dim,fontSize:12,whiteSpace:'nowrap' }}>{new Date(b.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'short'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

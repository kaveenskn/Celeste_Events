'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { Hotel, Users, BookOpen, TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface Stats { totalHotels:number; pendingHotels:number; approvedHotels:number; totalOwners:number; pendingOwners:number; totalBookings:number; revenue:number; }
interface RecentHotel { _id:string; name:string; location:string; status:string; createdAt:string; ownerId?:{fullName:string}; }

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats]   = useState<Stats|null>(null);
  const [hotels, setHotels] = useState<RecentHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/stats').then(r => { if(r.status===401){router.push('/login');throw new Error();} return r.json(); }),
      fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/hotels').then(r => r.ok ? r.json() : []),
    ]).then(([s, h]) => { setStats(s); setHotels(h.slice(0,6)); setLoading(false); }).catch(()=>setLoading(false));
  }, [router]);

  const C = { bg:'#070605',card:'#0e0c0b',border:'#1e1c1a',amber:'#d97706',muted:'#a8a29e',dim:'#57534e',green:'#10b981' };
  const S: Record<string,{bg:string;text:string;border:string}> = {
    pending:  {bg:'rgba(251,191,36,0.1)', text:'#fbbf24', border:'rgba(251,191,36,0.25)'},
    approved: {bg:'rgba(16,185,129,0.1)', text:'#10b981', border:'rgba(16,185,129,0.25)'},
    rejected: {bg:'rgba(239,68,68,0.1)',  text:'#f87171', border:'rgba(239,68,68,0.25)'},
  };

  if (loading) return <AdminLayout><div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><Loader2 style={{width:32,height:32,color:C.amber,animation:'spin 1s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ padding:'32px 36px 60px', background:C.bg, minHeight:'100vh' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <p style={{ color:C.amber, fontSize:11, fontWeight:700, letterSpacing:'0.2em', marginBottom:5 }}>OVERVIEW</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#fafaf9', fontWeight:600, marginBottom:6 }}>Admin Dashboard</h1>
          <p style={{ color:C.dim, fontSize:14 }}>Monitor venues, owners, and platform activity</p>
        </div>

        {/* Alert banners */}
        {stats && (stats.pendingHotels > 0 || stats.pendingOwners > 0) && (
          <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
            {stats.pendingHotels > 0 && (
              <Link href="/venues" style={{ flex:1, minWidth:240, display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:14, textDecoration:'none' }}>
                <Clock style={{ width:18, height:18, color:'#fbbf24', flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <p style={{ color:'#fbbf24', fontWeight:700, fontSize:13 }}>{stats.pendingHotels} venue{stats.pendingHotels>1?'s':''} awaiting approval</p>
                  <p style={{ color:C.dim, fontSize:12 }}>Review and approve to make them public</p>
                </div>
                <ArrowRight style={{ width:15, height:15, color:'#fbbf24' }} />
              </Link>
            )}
            {stats.pendingOwners > 0 && (
              <Link href="/applications" style={{ flex:1, minWidth:240, display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:'rgba(217,119,6,0.07)', border:'1px solid rgba(217,119,6,0.25)', borderRadius:14, textDecoration:'none' }}>
                <Users style={{ width:18, height:18, color:C.amber, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <p style={{ color:C.amber, fontWeight:700, fontSize:13 }}>{stats.pendingOwners} owner application{stats.pendingOwners>1?'s':''} pending</p>
                  <p style={{ color:C.dim, fontSize:12 }}>Review owner registration requests</p>
                </div>
                <ArrowRight style={{ width:15, height:15, color:C.amber }} />
              </Link>
            )}
          </div>
        )}

        {/* Stats grid */}
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
            {[
              { label:'Total Venues',    value:stats.totalHotels,    sub:`${stats.approvedHotels} live`,          icon:Hotel,      color:'#38bdf8' },
              { label:'Pending Venues',  value:stats.pendingHotels,  sub:'Awaiting review',                       icon:Clock,      color:'#fbbf24' },
              { label:'Venue Owners',    value:stats.totalOwners,    sub:`${stats.pendingOwners} applications`,   icon:Users,      color:C.amber  },
              { label:'Total Bookings',  value:stats.totalBookings,  sub:`$${stats.revenue.toLocaleString()} rev`,icon:TrendingUp, color:C.green  },
            ].map(({ label, value, sub, icon:Icon, color }) => (
              <div key={label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'20px 22px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon style={{ width:17, height:17, color }} />
                  </div>
                  <span style={{ color:C.dim, fontSize:11, fontWeight:700, letterSpacing:'0.1em' }}>{label.toUpperCase()}</span>
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#fafaf9', fontWeight:600, lineHeight:1, marginBottom:5 }}>{value}</p>
                <p style={{ color:C.dim, fontSize:12 }}>{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recent venues */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#fafaf9' }}>Recent Venues</h3>
            <Link href="/venues" style={{ color:C.amber, fontSize:13, fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:5 }}>View All <ArrowRight style={{width:14,height:14}}/></Link>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#070605', borderBottom:`1px solid ${C.border}` }}>
                  {['Venue','Owner','Location','Status','Added'].map(h=>(
                    <th key={h} style={{ padding:'11px 20px', textAlign:'left', color:C.dim, fontSize:11, fontWeight:700, letterSpacing:'0.1em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hotels.map(h => {
                  const sc = S[h.status] || S.pending;
                  return (
                    <tr key={h._id} style={{ borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:'13px 20px', color:'#e7e5e4', fontWeight:600, fontSize:14 }}>{h.name}</td>
                      <td style={{ padding:'13px 20px', color:C.muted, fontSize:13 }}>{h.ownerId?.fullName||'—'}</td>
                      <td style={{ padding:'13px 20px', color:C.dim, fontSize:13 }}>{h.location}</td>
                      <td style={{ padding:'13px 20px' }}>
                        <span style={{ background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, borderRadius:50, padding:'3px 11px', fontSize:11, fontWeight:700 }}>{h.status}</span>
                      </td>
                      <td style={{ padding:'13px 20px', color:C.dim, fontSize:12, whiteSpace:'nowrap' }}>
                        {new Date(h.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

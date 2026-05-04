'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Plus, X, Loader2, ArrowLeft, Save, Calendar } from 'lucide-react';
import AvailabilityCalendar from '@/components/calendar/AvailabilityCalendar';

interface Hotel { _id:string; name:string; location:string; description:string; basePrice:number; capacity:number; images:string[]; image360?:string; amenities?:string[]; }

export default function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'details'|'availability'>('details');
  const [form, setForm] = useState({ name:'',location:'',description:'',basePrice:'',capacity:'',image360:'' });
  const [images, setImages] = useState(['']);
  const [amenities, setAmenities] = useState(['']);
  const [blockDate, setBlockDate] = useState('');
  const [blockMsg, setBlockMsg] = useState('');

  useEffect(() => {
    fetch(`/api/hotels/${id}`).then(r=>r.ok?r.json():null).then(h => {
      if (h) {
        setForm({ name:h.name,location:h.location,description:h.description,basePrice:String(h.basePrice),capacity:String(h.capacity),image360:h.image360||'' });
        setImages(h.images?.length?h.images:['']);
        setAmenities(h.amenities?.length?h.amenities:['']);
      }
      setLoading(false);
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const res = await fetch(`/api/owner/hotels/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, basePrice:Number(form.basePrice), capacity:Number(form.capacity), images:images.filter(Boolean), amenities:amenities.filter(Boolean) }) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push('/owner/dashboard');
    } catch (e: unknown) { setError(e instanceof Error?e.message:'Failed'); }
    finally { setSaving(false); }
  };

  const blockDateFn = async () => {
    if (!blockDate) return;
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/availability', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({hotelId:id,date:blockDate,status:'blocked'}) });
    if (res.ok) { setBlockMsg(`✓ ${blockDate} marked as blocked.`); setBlockDate(''); }
  };

  const set = (k:keyof typeof form)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>setForm(f=>({...f,[k]:e.target.value}));
  const C = { bg:'#0c0a09',card:'#1c1917',border:'#292524',amber:'#d97706',dim:'#57534e' };
  const inp: React.CSSProperties = { width:'100%',background:'#111110',border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px',color:'#f5f5f4',fontSize:14,fontFamily:'inherit',outline:'none' };
  const lbl: React.CSSProperties = { color:C.dim,fontSize:11,fontWeight:700,letterSpacing:'0.15em',display:'block',marginBottom:7 };

  if (loading) return <OwnerLayout><div style={{display:'flex',justifyContent:'center',padding:80}}><Loader2 style={{width:28,height:28,color:C.amber,animation:'spin 1s linear infinite'}}/></div></OwnerLayout>;

  return (
    <OwnerLayout>
      <div style={{ padding:'32px',background:C.bg,minHeight:'100vh' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');input:focus,textarea:focus{border-color:#d97706!important;outline:none}textarea{resize:vertical}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ maxWidth:760 }}>
          <Link href="/owner/dashboard" style={{ display:'inline-flex',alignItems:'center',gap:6,color:C.dim,textDecoration:'none',fontSize:13,marginBottom:24 }}>
            <ArrowLeft style={{ width:14,height:14 }} /> Back
          </Link>
          <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.2em',marginBottom:4 }}>EDIT HOTEL</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:'#fafaf9',marginBottom:24 }}>{form.name||'Hotel Details'}</h1>

          {/* Tabs */}
          <div style={{ display:'flex',gap:6,marginBottom:24 }}>
            {(['details','availability'] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?C.amber:'#111110',color:tab===t?'#0c0a09':C.dim,border:`1px solid ${tab===t?C.amber:C.border}`,borderRadius:9,padding:'8px 18px',fontSize:12,fontWeight:700,letterSpacing:'0.1em',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6 }}>
                {t==='details'?<Save style={{width:13,height:13}}/>:<Calendar style={{width:13,height:13}}/>}
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {tab==='details'&&(
            <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:20 }}>
              <div style={{ background:'#111110',border:`1px solid ${C.border}`,borderRadius:16,padding:'22px' }}>
                <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.15em',marginBottom:16 }}>BASIC INFO</p>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>HOTEL NAME *</label><input required style={inp} value={form.name} onChange={set('name')}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>LOCATION *</label><input required style={inp} value={form.location} onChange={set('location')}/></div>
                  <div><label style={lbl}>BASE PRICE (USD)</label><input required type="number" style={inp} value={form.basePrice} onChange={set('basePrice')}/></div>
                  <div><label style={lbl}>CAPACITY</label><input required type="number" style={inp} value={form.capacity} onChange={set('capacity')}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>DESCRIPTION</label><textarea required rows={4} style={inp} value={form.description} onChange={set('description')}/></div>
                </div>
              </div>
              <div style={{ background:'#111110',border:`1px solid ${C.border}`,borderRadius:16,padding:'22px' }}>
                <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.15em',marginBottom:14 }}>IMAGES</p>
                {images.map((img,i)=>(
                  <div key={i} style={{ display:'flex',gap:8,marginBottom:8 }}>
                    <input style={{ ...inp,flex:1 }} value={img} onChange={e=>setImages(imgs=>imgs.map((im,j)=>j===i?e.target.value:im))} placeholder="https://..."/>
                    {images.length>1&&<button type="button" onClick={()=>setImages(imgs=>imgs.filter((_,j)=>j!==i))} style={{ background:'none',border:'none',color:'#f87171',cursor:'pointer' }}><X style={{width:16,height:16}}/></button>}
                  </div>
                ))}
                <button type="button" onClick={()=>setImages(i=>[...i,''])} style={{ background:'none',border:'none',color:C.amber,cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'inherit',display:'flex',alignItems:'center',gap:5 }}><Plus style={{width:13,height:13}}/>Add Image</button>
                <div style={{ marginTop:14 }}><label style={lbl}>360° IMAGE URL</label><input style={inp} value={form.image360} onChange={set('image360')}/></div>
              </div>
              <div style={{ background:'#111110',border:`1px solid ${C.border}`,borderRadius:16,padding:'22px' }}>
                <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.15em',marginBottom:14 }}>AMENITIES</p>
                {amenities.map((a,i)=>(
                  <div key={i} style={{ display:'flex',gap:8,marginBottom:8 }}>
                    <input style={{ ...inp,flex:1 }} value={a} onChange={e=>setAmenities(ams=>ams.map((am,j)=>j===i?e.target.value:am))} placeholder="e.g. Ballroom"/>
                    {amenities.length>1&&<button type="button" onClick={()=>setAmenities(ams=>ams.filter((_,j)=>j!==i))} style={{ background:'none',border:'none',color:'#f87171',cursor:'pointer' }}><X style={{width:16,height:16}}/></button>}
                  </div>
                ))}
                <button type="button" onClick={()=>setAmenities(a=>[...a,''])} style={{ background:'none',border:'none',color:C.amber,cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'inherit',display:'flex',alignItems:'center',gap:5 }}><Plus style={{width:13,height:13}}/>Add Amenity</button>
              </div>
              {error&&<p style={{ color:'#f87171',fontSize:13 }}>{error}</p>}
              <button type="submit" disabled={saving} style={{ background:saving?C.border:C.amber,color:saving?C.dim:'#0c0a09',border:'none',borderRadius:12,padding:'14px',fontWeight:900,fontSize:13,letterSpacing:'0.12em',cursor:saving?'not-allowed':'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                {saving?<><Loader2 style={{width:15,height:15,animation:'spin 1s linear infinite'}}/>SAVING…</>:<><Save style={{width:15,height:15}}/>SAVE CHANGES</>}
              </button>
            </form>
          )}

          {tab==='availability'&&(
            <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
              <div style={{ background:'#111110',border:`1px solid ${C.border}`,borderRadius:16,padding:'22px' }}>
                <p style={{ color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.15em',marginBottom:6 }}>BLOCK A DATE</p>
                <p style={{ color:C.dim,fontSize:13,marginBottom:14 }}>Click a date on the calendar to block it for new bookings.</p>
                <AvailabilityCalendar hotelId={id} selectedDate={blockDate} onSelectDate={d=>{setBlockDate(d);setBlockMsg('');}}/>
                {blockDate&&(
                  <div style={{ marginTop:14,display:'flex',gap:10,alignItems:'center' }}>
                    <span style={{ color:'#fbbf24',fontSize:13 }}>Block {blockDate}?</span>
                    <button onClick={blockDateFn} style={{ background:'#f87171',color:'#0c0a09',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit' }}>MARK AS BLOCKED</button>
                    <button onClick={async()=>{
                      const res=await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/availability',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hotelId:id,date:blockDate,status:'available'})});
                      if(res.ok){setBlockMsg(`✓ ${blockDate} set back to available.`);setBlockDate('');}
                    }} style={{ background:'#10b981',color:'#0c0a09',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit' }}>MARK AVAILABLE</button>
                  </div>
                )}
                {blockMsg&&<p style={{ color:'#10b981',fontSize:13,marginTop:10 }}>{blockMsg}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}

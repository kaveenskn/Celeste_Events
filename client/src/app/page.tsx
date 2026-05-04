'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin, Users, ArrowRight, Star, Loader2, Database,
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  Pause, Play, CheckCircle2, Heart, Sparkles, Award,
  Globe, Phone, Mail, Share2, Heart as HeartIcon, ExternalLink
} from 'lucide-react';

/* ─── Types ─── */
interface Hotel {
  _id: string; name: string; location: string; description: string;
  basePrice: number; capacity: number; images: string[];
  amenities?: string[]; rating?: number; status?: string;
}

/* ─── Sample fallback hotels (shown when DB is empty / not connected) ─── */
const SAMPLE_HOTELS: Hotel[] = [
  { _id:'sample-1', name:'The Grand Meridian', location:'Colombo 03, Sri Lanka', rating:4.9,
    description:'An iconic luxury hotel in the heart of Colombo with breathtaking ocean views, a grand ballroom for 500 guests, AV equipment, and professional event planners.',
    basePrice:5000, capacity:500, images:['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'],
    amenities:['Grand Ballroom','Rooftop Terrace','Infinity Pool','Valet Parking','Bridal Suite'] },
  { _id:'sample-2', name:'Kandy Hills Resort', location:'Kandy, Sri Lanka', rating:4.6,
    description:'Perched amid misty hills and tea gardens, this heritage resort offers a magical setting for weddings and corporate events with colonial charm.',
    basePrice:3500, capacity:300, images:['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'],
    amenities:['Garden Pavilion','Tea Garden Views','Heritage Spa','Cultural Shows','Bonfire Terrace'] },
  { _id:'sample-3', name:'Galle Fort Palace', location:'Galle, Sri Lanka', rating:4.8,
    description:'A UNESCO-listed colonial masterpiece with cobblestone courtyards and Dutch archways — a breathtaking backdrop for intimate celebrations.',
    basePrice:4200, capacity:200, images:['https://images.unsplash.com/photo-1537639622086-7d0ad12e1fbb?w=800&q=80'],
    amenities:['Stone Courtyard','Ocean Terrace','Colonial Ballroom','Sunset Deck','Candlelit Dining'] },
  { _id:'sample-4', name:'Mirissa Oceanfront Estate', location:'Mirissa, Sri Lanka', rating:4.7,
    description:'A beachfront luxury venue where the Indian Ocean is your backdrop — perfect for beach weddings, galas, and sunset celebrations.',
    basePrice:6000, capacity:400, images:['https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=800&q=80'],
    amenities:['Private Beach','Infinity Pool','Beach Bar','Whale Watching','Bonfire Pit'] },
  { _id:'sample-5', name:'Ella Mountain Lodge', location:'Ella, Sri Lanka', rating:4.5,
    description:'At 1,200m above sea level amid tea estates and rock formations, this intimate lodge is perfect for exclusive retreats and romantic elopements.',
    basePrice:2800, capacity:150, images:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'],
    amenities:['Mountain Views','Tea Estate Tours','Stargazing Deck','Organic Garden','Firepit Lounge'] },
  { _id:'sample-6', name:'Colombo Skyline Rooftop', location:'Colombo 07, Sri Lanka', rating:4.8,
    description:'32 floors above Colombo with 360° panoramic views. A sleek modern space with a retractable glass roof — ideal for product launches and high-profile events.',
    basePrice:7500, capacity:350, images:['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'],
    amenities:['360° Views','Retractable Roof','LED Dance Floor','Premium Bar','Helipad Access'] },
];

/* ─── Hero slides ─── */
const HERO_SLIDES = [
  { img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=90', label: 'Wedding Celebrations',  sub: 'Timeless moments, perfect venues' },
  { img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=90',   label: 'Grand Ballrooms',        sub: 'Elegance beyond imagination' },
  { img: 'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=1800&q=90',   label: 'Beachfront Galas',       sub: 'Where the ocean sets the stage' },
  { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=90',label: 'Mountain Retreats',      sub: 'Elevation meets celebration' },
  { img: 'https://images.unsplash.com/photo-1537639622086-7d0ad12e1fbb?w=1800&q=90',label: 'Heritage Palaces',       sub: 'History as your backdrop' },
];

/* ─── Trending slider data ─── */
const TRENDING = [
  { img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', name: 'The Grand Meridian',       location: 'Colombo',  price: 5000, rating: 4.9 },
  { img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', name: 'Kandy Hills Resort',        location: 'Kandy',    price: 3500, rating: 4.6 },
  { img: 'https://images.unsplash.com/photo-1537639622086-7d0ad12e1fbb?w=600&q=80', name: 'Galle Fort Palace',     location: 'Galle',    price: 4200, rating: 4.8 },
  { img: 'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=600&q=80', name: 'Mirissa Oceanfront',       location: 'Mirissa',  price: 6000, rating: 4.7 },
  { img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', name: 'Ella Mountain Lodge',   location: 'Ella',     price: 2800, rating: 4.5 },
  { img: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=600&q=80', name: 'Sigiriya Jungle Retreat',location: 'Dambulla', price: 3200, rating: 4.6 },
];

/* ─── Star display ─── */
function Stars({ r }: { r: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={11} height={11} viewBox="0 0 24 24"
          fill={r >= s ? '#d97706' : r >= s-0.5 ? 'url(#h)' : 'none'}
          stroke="#d97706" strokeWidth={2}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */
export default function HomePage() {
  const [hotels, setHotels]   = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbOk, setDbOk]       = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState<'rating'|'price-asc'|'price-desc'|'capacity'>('rating');
  const [minRating, setMinRating] = useState(0);

  /* hero */
  const [slide, setSlide]   = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const nextSlide = useCallback(() => setSlide(s => (s+1)%HERO_SLIDES.length), []);
  const prevSlide = useCallback(() => setSlide(s => (s-1+HERO_SLIDES.length)%HERO_SLIDES.length), []);
  useEffect(() => {
    if (paused) { if(timerRef.current)clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(nextSlide, 4800);
    return () => { if(timerRef.current)clearInterval(timerRef.current); };
  }, [paused, nextSlide]);

  /* trending slider */
  const [tIdx, setTIdx] = useState(0);
  const visibleCount = 3;
  const tNext = () => setTIdx(i => Math.min(i+1, TRENDING.length-visibleCount));
  const tPrev = () => setTIdx(i => Math.max(i-1, 0));

  /* data */
  const fetchHotels = async () => {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/hotels');
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setHotels(data.map((h: Hotel) => ({ ...h, rating: h.rating ?? 4.5 })));
        setDbOk(true);
      } else {
        // DB connected but empty — show sample + seed prompt
        setHotels(SAMPLE_HOTELS);
      }
    } catch {
      // DB not connected — show sample data so page is always useful
      setHotels(SAMPLE_HOTELS);
    } finally { setLoading(false); }
  };

  const seedDb = async () => {
    setSeeding(true);
    try { await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/seed',{method:'POST'}); await fetchHotels(); }
    catch {} finally { setSeeding(false); }
  };

  useEffect(() => { fetchHotels(); }, []);

  const filtered = hotels
    .filter(h => (h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase())) && (minRating === 0 || (h.rating??0) >= minRating))
    .sort((a,b) => sortBy==='price-asc'?a.basePrice-b.basePrice : sortBy==='price-desc'?b.basePrice-a.basePrice : sortBy==='capacity'?b.capacity-a.capacity : (b.rating??0)-(a.rating??0));

  const C = { bg:'#0c0a09', card:'#1c1917', border:'#292524', amber:'#d97706', muted:'#a8a29e', dim:'#57534e', green:'#10b981' };

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
    <style>{`
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
      @keyframes progressBar{from{width:0}to{width:100%}}
      .htxt{animation:fadeUp 0.7s ease both}
      .vcard{transition:transform 0.32s ease,box-shadow 0.32s ease,border-color 0.32s ease;text-decoration:none;display:block}
      .vcard:hover{transform:translateY(-6px);box-shadow:0 28px 52px rgba(0,0,0,0.65),0 0 0 1px rgba(217,119,6,0.3)!important;border-color:rgba(217,119,6,0.35)!important}
      .vcard:hover .cimg{transform:scale(1.08)}
      .cimg{transition:transform 0.65s ease;display:block}
      .vcard:hover .vlnk{gap:10px!important;color:#fbbf24!important}
      .vlnk{display:flex;align-items:center;gap:6px;transition:all 0.2s}
      .ctrl{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(12,10,9,0.7);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.15);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;z-index:10}
      .ctrl:hover{background:rgba(217,119,6,0.8);border-color:#d97706}
      .hdot{transition:all 0.3s ease;border:none;cursor:pointer;padding:0}
      .hdot:hover{transform:scale(1.3)}
      .rtag{border:none;cursor:pointer;border-radius:50px;font-family:inherit;font-weight:700;font-size:12px;transition:all 0.2s}
      .rtag:hover{border-color:#d97706!important;color:#d97706!important}
      input:focus,select:focus{outline:none;border-color:#d97706!important}
      .tcard{border-radius:16px;overflow:hidden;flex-shrink:0;transition:transform 0.25s ease,box-shadow 0.25s ease}
      .tcard:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.6)}
      .feat-item{display:flex;align-items:flex-start;gap:16px;padding:24px;border-radius:18px;border:1px solid #292524;background:#111110;transition:all 0.25s}
      .feat-item:hover{border-color:rgba(217,119,6,0.3);background:rgba(217,119,6,0.04)}
    `}</style>

    {/* ═══════════ HERO SLIDER ═══════════ */}
    <div style={{ position:'relative', height:'92vh', minHeight:560, maxHeight:860, overflow:'hidden' }}>
      {HERO_SLIDES.map((s, i) => (
        <div key={i} style={{ position:'absolute', inset:0, opacity:i===slide?1:0, transition:'opacity 1.1s ease', zIndex:i===slide?1:0 }}>
          <img src={s.img} alt={s.label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
        </div>
      ))}
      <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to bottom,rgba(12,10,9,0.5) 0%,rgba(12,10,9,0.05) 30%,rgba(12,10,9,0.2) 60%,rgba(12,10,9,0.97) 100%)' }}/>
      <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to right,rgba(12,10,9,0.65) 0%,transparent 55%)' }}/>

      {/* Label pill */}
      <div style={{ position:'absolute', top:28, right:28, zIndex:10, background:'rgba(12,10,9,0.72)', backdropFilter:'blur(10px)', border:'1px solid rgba(217,119,6,0.3)', borderRadius:50, padding:'6px 16px', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:C.amber, boxShadow:`0 0 8px ${C.amber}` }}/>
        <span style={{ color:'#fbbf24', fontSize:12, fontWeight:700, letterSpacing:'0.12em' }}>{HERO_SLIDES[slide].label}</span>
      </div>

      {/* Hero text */}
      <div style={{ position:'absolute', inset:0, zIndex:5, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 48px 88px' }}>
        <div style={{ maxWidth:700 }} className="htxt">
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:50, border:'1px solid rgba(217,119,6,0.4)', background:'rgba(217,119,6,0.1)', marginBottom:22 }}>
            <Star style={{ width:13, height:13, color:C.amber, fill:C.amber }}/>
            <span style={{ color:'#fbbf24', fontSize:12, fontWeight:700, letterSpacing:'0.18em' }}>SRI LANKA'S FINEST EVENT VENUES</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(38px,5.5vw,76px)', color:'#fafaf9', lineHeight:1.05, marginBottom:14, fontWeight:600 }}>
            {HERO_SLIDES[slide].label}
          </h1>
          <p style={{ color:'#c7c0b8', fontSize:17, lineHeight:1.7, marginBottom:32, maxWidth:480 }}>
            {HERO_SLIDES[slide].sub} — discover extraordinary venues for weddings, galas, and corporate events.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <a href="#venues" style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.amber, color:'#0c0a09', borderRadius:12, padding:'13px 28px', fontWeight:900, fontSize:14, letterSpacing:'0.1em', textDecoration:'none' }}>
              EXPLORE VENUES <ArrowRight style={{ width:16, height:16 }}/>
            </a>
            <Link href="/list-venue" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.08)', color:'#fafaf9', borderRadius:12, padding:'13px 28px', fontWeight:700, fontSize:14, textDecoration:'none', border:'1px solid rgba(255,255,255,0.15)', backdropFilter:'blur(8px)' }}>
              LIST YOUR VENUE
            </Link>
          </div>
          {/* Stats row */}
          <div style={{ display:'flex', gap:28, marginTop:40, flexWrap:'wrap' }}>
            {[['4','Premium Venues'],['500+','Events Hosted'],['10K+','Happy Guests'],['4.8★','Avg Rating']].map(([n,l])=>(
              <div key={l} style={{ borderLeft:'2px solid rgba(217,119,6,0.4)', paddingLeft:14 }}>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:C.amber, fontWeight:700, lineHeight:1 }}>{n}</p>
                <p style={{ color:C.dim, fontSize:11, letterSpacing:'0.1em', marginTop:5 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button className="ctrl" onClick={prevSlide} style={{ left:20 }}><ChevronLeft style={{ width:22, height:22 }}/></button>
      <button className="ctrl" onClick={nextSlide} style={{ right:20 }}><ChevronRight style={{ width:22, height:22 }}/></button>

      {/* Dots + pause */}
      <div style={{ position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)', zIndex:10, display:'flex', alignItems:'center', gap:12 }}>
        {HERO_SLIDES.map((_,i)=>(
          <button key={i} className="hdot" onClick={()=>setSlide(i)} style={{ width:i===slide?28:8, height:8, borderRadius:50, background:i===slide?C.amber:'rgba(255,255,255,0.28)', boxShadow:i===slide?`0 0 10px ${C.amber}88`:'none' }}/>
        ))}
        <div style={{ width:1, height:16, background:'rgba(255,255,255,0.15)', margin:'0 4px' }}/>
        <button onClick={()=>setPaused(p=>!p)} style={{ background:'rgba(12,10,9,0.6)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', color:'#a8a29e', cursor:'pointer' }}>
          {paused?<Play style={{ width:12, height:12 }}/>:<Pause style={{ width:12, height:12 }}/>}
        </button>
      </div>
      <div style={{ position:'absolute', bottom:30, right:28, zIndex:10, color:'rgba(255,255,255,0.3)', fontSize:13, fontWeight:700 }}>
        {String(slide+1).padStart(2,'0')} / {String(HERO_SLIDES.length).padStart(2,'0')}
      </div>
      {/* Progress bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, zIndex:10, background:'rgba(255,255,255,0.07)' }}>
        <div key={`${slide}-${paused}`} style={{ height:'100%', background:C.amber, animation:paused?'none':'progressBar 4.8s linear forwards', borderRadius:'0 2px 2px 0' }}/>
      </div>
    </div>

    {/* ═══════════ TRENDING SECTION ═══════════ */}
    <div style={{ padding:'72px 0 60px', background:'linear-gradient(to bottom,#0c0a09,#110d08,#0c0a09)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.25)', borderRadius:50, padding:'5px 14px', marginBottom:14 }}>
              <Sparkles style={{ width:13, height:13, color:C.amber }}/>
              <span style={{ color:'#fbbf24', fontSize:11, fontWeight:700, letterSpacing:'0.18em' }}>TRENDING NOW</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,3.5vw,40px)', color:'#fafaf9', fontWeight:600, lineHeight:1.1 }}>
              Most Popular<br/><span style={{ color:C.amber, fontStyle:'italic' }}>Venues</span>
            </h2>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={tPrev} disabled={tIdx===0} style={{ width:40, height:40, borderRadius:'50%', border:`1px solid ${C.border}`, background:'transparent', color:tIdx===0?C.border:'#e7e5e4', cursor:tIdx===0?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              <ChevronLeft style={{ width:18, height:18 }}/>
            </button>
            <button onClick={tNext} disabled={tIdx>=TRENDING.length-visibleCount} style={{ width:40, height:40, borderRadius:'50%', border:`1px solid ${tIdx>=TRENDING.length-visibleCount?C.border:C.amber}`, background:tIdx>=TRENDING.length-visibleCount?'transparent':'rgba(217,119,6,0.1)', color:tIdx>=TRENDING.length-visibleCount?C.border:C.amber, cursor:tIdx>=TRENDING.length-visibleCount?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              <ChevronRight style={{ width:18, height:18 }}/>
            </button>
          </div>
        </div>

        {/* Slider */}
        <div style={{ overflow:'hidden' }}>
          <div style={{ display:'flex', gap:20, transform:`translateX(calc(-${tIdx * (100/visibleCount)}% - ${tIdx*20/visibleCount}px))`, transition:'transform 0.45s ease' }}>
            {TRENDING.map((v, i) => (
              <div key={i} className="tcard" style={{ width:`calc(${100/visibleCount}% - ${20*(visibleCount-1)/visibleCount}px)`, background:C.card, border:`1px solid ${C.border}` }}>
                <div style={{ height:200, overflow:'hidden', position:'relative' }}>
                  <img src={v.img} alt={v.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.6s ease' }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,#1c1917 0%,transparent 55%)' }}/>
                  <div style={{ position:'absolute', top:12, left:12, background:C.amber, color:'#0c0a09', borderRadius:50, padding:'4px 12px', fontSize:11, fontWeight:900 }}>
                    FROM ${v.price.toLocaleString()}
                  </div>
                  <div style={{ position:'absolute', top:12, right:12, display:'flex', alignItems:'center', gap:5, background:'rgba(12,10,9,0.8)', backdropFilter:'blur(6px)', borderRadius:50, padding:'4px 10px', border:'1px solid rgba(217,119,6,0.3)' }}>
                    <Star style={{ width:11, height:11, fill:C.amber, color:C.amber }}/>
                    <span style={{ color:'#fbbf24', fontSize:11, fontWeight:900 }}>{v.rating}</span>
                  </div>
                </div>
                <div style={{ padding:'16px 18px' }}>
                  <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#fafaf9', fontWeight:600, marginBottom:5 }}>{v.name}</h4>
                  <div style={{ display:'flex', alignItems:'center', gap:5, color:C.dim, fontSize:12, marginBottom:10 }}>
                    <MapPin style={{ width:12, height:12, color:C.amber }}/>{v.location}, Sri Lanka
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <Stars r={v.rating}/>
                    <span style={{ color:C.amber, fontSize:12, fontWeight:700 }}>{v.rating} ★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:24 }}>
          {Array.from({length:TRENDING.length-visibleCount+1}).map((_,i)=>(
            <button key={i} onClick={()=>setTIdx(i)} style={{ width:i===tIdx?20:7, height:7, borderRadius:50, border:'none', cursor:'pointer', background:i===tIdx?C.amber:'rgba(255,255,255,0.15)', transition:'all 0.3s', padding:0 }}/>
          ))}
        </div>
      </div>
    </div>

    {/* ═══════════ VENUES SECTION ═══════════ */}
    <div id="venues" style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px 80px' }}>

      {/* DB banner */}
      {!loading && !dbOk && (
        <div style={{ marginBottom:36, padding:'16px 20px', borderRadius:16, background:'#1a0f05', border:'1px solid rgba(146,64,14,0.4)', display:'flex', flexWrap:'wrap', gap:16, alignItems:'center' }}>
          <div style={{ flex:1, minWidth:260 }}>
            <p style={{ color:'#fbbf24', fontWeight:700, fontSize:14, marginBottom:4 }}>Database not connected</p>
            <p style={{ color:C.dim, fontSize:13, lineHeight:1.6 }}>
              Add <code style={{ background:'#292524', color:C.amber, padding:'1px 6px', borderRadius:4 }}>MONGODB_URI</code> to <code style={{ background:'#292524', color:C.amber, padding:'1px 6px', borderRadius:4 }}>.env.local</code>, then seed sample data.
            </p>
          </div>
          <button onClick={seedDb} disabled={seeding} style={{ background:C.amber, color:'#0c0a09', border:'none', borderRadius:10, padding:'10px 20px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}>
            {seeding?<Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }}/>:<Database style={{ width:15, height:15 }}/>}
            {seeding?'SEEDING…':'SEED SAMPLE DATA'}
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:20, marginBottom:32 }}>
        <div>
          <p style={{ color:C.amber, fontSize:11, fontWeight:700, letterSpacing:'0.2em', marginBottom:6 }}>OUR COLLECTION</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#fafaf9', fontWeight:600 }}>
            Featured Venues <span style={{ color:C.dim, fontSize:16, fontWeight:400, fontFamily:'inherit', marginLeft:8 }}>({filtered.length})</span>
          </h2>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end' }}>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ position:'relative' }}>
              <Search style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:C.dim, pointerEvents:'none' }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search venues…"
                style={{ paddingLeft:34, paddingRight:14, paddingTop:10, paddingBottom:10, borderRadius:10, background:C.card, border:`1px solid ${C.border}`, color:'#e7e5e4', fontSize:13, width:190, fontFamily:'inherit' }}/>
            </div>
            <div style={{ position:'relative' }}>
              <SlidersHorizontal style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:C.dim, pointerEvents:'none' }}/>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value as typeof sortBy)}
                style={{ paddingLeft:34, paddingRight:14, paddingTop:10, paddingBottom:10, borderRadius:10, background:C.card, border:`1px solid ${C.border}`, color:'#e7e5e4', fontSize:13, fontFamily:'inherit', cursor:'pointer', appearance:'none' }}>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="capacity">By Capacity</option>
              </select>
            </div>
          </div>
          {/* Rating filter */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Star style={{ width:13, height:13, color:C.amber, fill:C.amber }}/>
            <span style={{ color:C.dim, fontSize:12, fontWeight:600, letterSpacing:'0.08em' }}>RATING:</span>
            {[{l:'All',v:0},{l:'4.5+',v:4.5},{l:'4.7+',v:4.7},{l:'4.9+',v:4.9}].map(({l,v})=>(
              <button key={v} className="rtag" onClick={()=>setMinRating(v)}
                style={{ padding:'5px 13px', background:minRating===v?C.amber:'transparent', color:minRating===v?'#0c0a09':C.muted, border:`1px solid ${minRating===v?C.amber:C.border}` }}>
                {v>0?<span style={{ display:'flex', alignItems:'center', gap:3 }}><Star style={{ width:10, height:10, fill:minRating===v?'#0c0a09':C.amber, color:minRating===v?'#0c0a09':C.amber }}/>{l}</span>:l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 0', gap:12 }}>
          <Loader2 style={{ width:28, height:28, color:C.amber, animation:'spin 1s linear infinite' }}/>
          <span style={{ color:C.dim }}>Loading venues…</span>
        </div>
      ) : filtered.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', border:`1px dashed ${C.border}`, borderRadius:16 }}>
          <p style={{ color:C.muted, fontSize:18, marginBottom:8 }}>No venues match your filters</p>
          <button onClick={()=>{setSearch('');setMinRating(0);}} style={{ background:'none', border:'none', color:C.amber, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>Clear filters →</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
          {filtered.map((hotel, i) => (
            <Link key={hotel._id} href={`/hotels/${hotel._id}`} className="vcard"
              style={{ borderRadius:20, overflow:'hidden', background:C.card, border:`1px solid ${C.border}` }}>
              <div style={{ height:220, overflow:'hidden', position:'relative' }}>
                <img src={hotel.images[0]||'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80'} alt={hotel.name} className="cimg" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,#1c1917 0%,transparent 55%)' }}/>
                <div style={{ position:'absolute', top:14, left:14, background:C.amber, color:'#0c0a09', borderRadius:50, padding:'5px 14px', fontSize:11, fontWeight:900, letterSpacing:'0.1em' }}>
                  FROM ${hotel.basePrice.toLocaleString()}
                </div>
                <div style={{ position:'absolute', top:14, right:14, display:'flex', alignItems:'center', gap:5, background:'rgba(12,10,9,0.82)', backdropFilter:'blur(6px)', border:'1px solid rgba(217,119,6,0.35)', borderRadius:50, padding:'5px 10px' }}>
                  <Star style={{ width:12, height:12, fill:C.amber, color:C.amber }}/>
                  <span style={{ color:'#fbbf24', fontSize:12, fontWeight:900 }}>{(hotel.rating??4.5).toFixed(1)}</span>
                </div>
              </div>
              <div style={{ padding:'20px 22px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:6 }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#fafaf9', fontWeight:600, lineHeight:1.25 }}>{hotel.name}</h3>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <Stars r={hotel.rating??4.5}/>
                  <span style={{ color:C.muted, fontSize:12 }}>{(hotel.rating??4.5).toFixed(1)}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, color:C.dim, fontSize:13, marginBottom:10 }}>
                  <MapPin style={{ width:13, height:13, color:C.amber }}/>{hotel.location}
                </div>
                <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{hotel.description}</p>
                {hotel.amenities&&(
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                    {hotel.amenities.slice(0,3).map(a=><span key={a} style={{ background:'#111110', border:`1px solid ${C.border}`, borderRadius:50, padding:'3px 10px', fontSize:11, color:'#a8a29e' }}>{a}</span>)}
                    {(hotel.amenities.length>3)&&<span style={{ background:'#111110', border:`1px solid ${C.border}`, borderRadius:50, padding:'3px 10px', fontSize:11, color:C.dim }}>+{hotel.amenities.length-3}</span>}
                  </div>
                )}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, color:C.dim, fontSize:12 }}>
                    <Users style={{ width:13, height:13 }}/> Up to {hotel.capacity.toLocaleString()} guests
                  </div>
                  <span className="vlnk" style={{ color:C.amber, fontSize:13, fontWeight:700 }}>
                    Explore <ArrowRight style={{ width:15, height:15 }}/>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      {!loading&&hotels.length>0&&(
        <div style={{ textAlign:'center', marginTop:48 }}>
          <Link href="/list-venue" style={{ display:'inline-flex', alignItems:'center', gap:10, background:'transparent', border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 32px', color:C.muted, fontWeight:700, fontSize:14, textDecoration:'none', transition:'all 0.2s' }}>
            Want to list your venue? <ArrowRight style={{ width:16, height:16, color:C.amber }}/>
          </Link>
        </div>
      )}
    </div>

    {/* ═══════════ ABOUT US ═══════════ */}
    <div style={{ background:'linear-gradient(160deg,#110d08 0%,#0c0a09 50%,#0a0f0a 100%)', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 24px' }}>
        {/* Intro */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', marginBottom:80 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:50, padding:'5px 14px', marginBottom:20 }}>
              <Award style={{ width:13, height:13, color:'#10b981' }}/>
              <span style={{ color:'#10b981', fontSize:11, fontWeight:700, letterSpacing:'0.18em' }}>ABOUT CÉLESTE EVENTS</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,3.5vw,44px)', color:'#fafaf9', fontWeight:600, lineHeight:1.15, marginBottom:20 }}>
              Crafting Unforgettable<br/><span style={{ color:C.amber, fontStyle:'italic' }}>Celebrations</span>
            </h2>
            <p style={{ color:C.muted, fontSize:15, lineHeight:1.85, marginBottom:16 }}>
              Founded in 2019, Céleste Events is Sri Lanka's premier luxury event venue platform. We connect discerning hosts with the island's finest hotels, heritage properties, and beachfront estates — exclusively for celebrations, not accommodation.
            </p>
            <p style={{ color:C.dim, fontSize:14, lineHeight:1.8, marginBottom:28 }}>
              From intimate birthday dinners to grand wedding receptions for 500 guests, our curated collection of venues is handpicked, verified, and managed by dedicated event specialists who understand that every detail matters.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
              {[
                { icon:CheckCircle2, text:'Verified luxury venues only', color:'#10b981' },
                { icon:Heart,        text:'Events-only, no accommodation', color:'#f472b6' },
                { icon:Globe,        text:'Across all of Sri Lanka', color:C.amber },
              ].map(({icon:Icon,text,color})=>(
                <div key={text} style={{ display:'flex', alignItems:'center', gap:9, color:C.muted, fontSize:13 }}>
                  <Icon style={{ width:15, height:15, color, flexShrink:0 }}/>{text}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80'].map((src,i)=>(
              <div key={i} style={{ borderRadius:14, overflow:'hidden', height:160, boxShadow:'0 8px 24px rgba(0,0,0,0.5)', transform:i%2===1?'translateY(16px)':'none' }}>
                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom:80 }}>
          <p style={{ color:C.amber, fontSize:11, fontWeight:700, letterSpacing:'0.2em', textAlign:'center', marginBottom:14 }}>WHY CHOOSE US</p>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#fafaf9', textAlign:'center', fontWeight:600, marginBottom:40 }}>The Céleste Difference</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
            {[
              { icon:Award,        title:'Curated & Verified',   desc:'Every venue is personally inspected and verified by our team before listing. No surprises — only excellence.',       color:'#fbbf24' },
              { icon:Heart,        title:'End-to-End Planning',  desc:'From menu curation to DJ packages and real-time cost calculation, we make planning seamless and transparent.',     color:'#f472b6' },
              { icon:CheckCircle2, title:'Instant Confirmation', desc:'Book with confidence — receive instant booking confirmation and a dedicated event coordinator within 24 hours.',   color:C.green   },
              { icon:Star,         title:'Exclusive Menus',      desc:'Bespoke culinary menus crafted by each venue\'s chefs — from traditional Sri Lankan cuisine to international fare.',color:C.amber   },
              { icon:Globe,        title:'Island-Wide Reach',    desc:'Venues spanning Colombo to the South Coast, hill country to the cultural triangle — wherever your dream takes you.',color:'#38bdf8' },
              { icon:Sparkles,     title:'Premium Experience',   desc:'Complimentary 360° virtual tours, live availability calendars, and demo booking — transparency at every step.',   color:'#a78bfa' },
            ].map(({icon:Icon,title,desc,color})=>(
              <div key={title} className="feat-item">
                <div style={{ width:44, height:44, borderRadius:12, background:`${color}12`, border:`1px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon style={{ width:20, height:20, color }}/>
                </div>
                <div>
                  <p style={{ color:'#e7e5e4', fontWeight:700, fontSize:15, marginBottom:6 }}>{title}</p>
                  <p style={{ color:C.dim, fontSize:13, lineHeight:1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats banner */}
        <div style={{ background:'rgba(217,119,6,0.06)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'40px 48px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center', marginBottom:80 }}>
          {[['2019','Year Founded'],['4+','Luxury Venues'],['500+','Events Hosted'],['$2M+','Revenue Generated']].map(([n,l])=>(
            <div key={l}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:36, color:C.amber, fontWeight:700, lineHeight:1, marginBottom:8 }}>{n}</p>
              <p style={{ color:C.dim, fontSize:13, letterSpacing:'0.1em' }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Team / Contact */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40 }}>
          <div>
            <p style={{ color:C.amber, fontSize:11, fontWeight:700, letterSpacing:'0.2em', marginBottom:14 }}>GET IN TOUCH</p>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#fafaf9', fontWeight:600, marginBottom:16 }}>Let's Plan Your<br/>Perfect Event</h3>
            <p style={{ color:C.dim, fontSize:14, lineHeight:1.8, marginBottom:24 }}>
              Whether you're planning a wedding, corporate retreat, or birthday celebration — our team is ready to help you find the perfect venue and curate every detail.
            </p>
            {[
              { icon:Phone, text:'+94 11 234 5678',        label:'Call Us' },
              { icon:Mail,  text:'hello@celeste.events.lk', label:'Email Us' },
              { icon:MapPin,text:'Colombo 03, Sri Lanka',   label:'Visit Us' },
            ].map(({icon:Icon,text,label})=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon style={{ width:16, height:16, color:C.amber }}/>
                </div>
                <div>
                  <p style={{ color:C.dim, fontSize:11, fontWeight:700, letterSpacing:'0.12em', marginBottom:2 }}>{label}</p>
                  <p style={{ color:'#e7e5e4', fontSize:14 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
            <div style={{ background:'#111110', border:`1px solid ${C.border}`, borderRadius:18, padding:'28px 30px' }}>
              <p style={{ color:'#e7e5e4', fontWeight:700, fontSize:16, marginBottom:6 }}>Want to list your venue?</p>
              <p style={{ color:C.dim, fontSize:13, lineHeight:1.7, marginBottom:20 }}>Join Sri Lanka's fastest-growing event venue platform. Reach thousands of event planners every month and grow your business.</p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.amber, color:'#0c0a09', borderRadius:10, padding:'12px 22px', fontWeight:900, fontSize:13, letterSpacing:'0.1em', textDecoration:'none' }}>
                  APPLY NOW <ArrowRight style={{ width:15, height:15 }}/>
                </Link>
                <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'transparent', border:`1px solid ${C.border}`, color:C.muted, borderRadius:10, padding:'12px 22px', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                  OWNER LOGIN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ═══════════ FOOTER ═══════════ */}
    <footer style={{ background:'#070605', borderTop:`1px solid ${C.border}`, padding:'40px 24px 30px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:32, marginBottom:32 }}>
          <div style={{ maxWidth:280 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fafaf9', marginBottom:10 }}>Céleste <span style={{ color:C.amber }}>Events</span></p>
            <p style={{ color:C.dim, fontSize:13, lineHeight:1.7 }}>Sri Lanka's premier luxury event venue booking platform — exclusively for celebrations.</p>
            <div style={{ display:'flex', gap:12, marginTop:16 }}>
              {[Share2, HeartIcon, ExternalLink].map((Icon, i) => (
                <div key={i} style={{ width:34, height:34, borderRadius:'50%', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                  <Icon style={{ width:15, height:15, color:C.dim }}/>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:48, flexWrap:'wrap' }}>
            {[
              { title:'Platform', links:['Browse Venues','List Your Venue','Owner Login','Admin Portal'] },
              { title:'Company', links:['About Us','How It Works','Contact','Privacy Policy'] },
              { title:'Support', links:['Help Center','Booking Guide','Cancellation','Terms of Service'] },
            ].map(({title,links})=>(
              <div key={title}>
                <p style={{ color:'#e7e5e4', fontSize:13, fontWeight:700, letterSpacing:'0.1em', marginBottom:14 }}>{title.toUpperCase()}</p>
                {links.map(l=><p key={l} style={{ color:C.dim, fontSize:13, marginBottom:8, cursor:'pointer' }}>{l}</p>)}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ color:'#3c3836', fontSize:12 }}>© 2024 Céleste Events. All rights reserved.</p>
          <p style={{ color:'#3c3836', fontSize:12 }}>Events Only · No Accommodation · Sri Lanka</p>
        </div>
      </div>
    </footer>
    </div>
  );
}

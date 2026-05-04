'use client';
import { use, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin, Users, Star, Check, ArrowLeft, ChevronLeft, ChevronRight,
  X, Expand, RotateCcw, Move, Loader2, Plus, Minus,
  Utensils, Wine, IceCream, Salad, ChefHat, Calendar,
  TrendingUp, Sparkles, CheckCircle2, Music2, CreditCard,
  Lock, PartyPopper, Cake, Heart, Briefcase, Mic2,
  Volume2, Zap, Shield, AlertCircle
} from 'lucide-react';
import AvailabilityCalendar from '@/components/calendar/AvailabilityCalendar';

/* ─────────────────────── DATA ─────────────────────── */
interface Hotel { _id:string; name:string; location:string; description:string; basePrice:number; capacity:number; images:string[]; image360?:string; amenities?:string[]; }
interface MenuItem { _id:string; name:string; description:string; pricePerPlate:number; category:string; image?:string; }
interface DJPackage { _id:string; name:string; description:string; price:number; duration:string; features:string[]; popular?:boolean; }

const ALL_HOTELS: Record<string,Hotel> = {
  'sample-1':{ _id:'sample-1', name:'The Grand Meridian', location:'Colombo, Sri Lanka',
    description:'An iconic luxury hotel in the heart of Colombo offering breathtaking ocean views, world-class amenities, and an unparalleled event experience. Our grand ballroom accommodates up to 500 guests with state-of-the-art AV equipment, a dedicated bridal suite, and professional event planners to transform your vision into reality.',
    basePrice:5000, capacity:500,
    images:['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85'],
    image360:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=2400&q=85',
    amenities:['Grand Ballroom','Rooftop Terrace','Infinity Pool','Valet Parking','Full AV Suite','Bridal Suite','Catering Kitchen','Dedicated Event Planner'] },
  'sample-2':{ _id:'sample-2', name:'Kandy Hills Resort', location:'Kandy, Sri Lanka',
    description:'Perched among the misty hills of Kandy, this heritage resort offers a magical setting for weddings and corporate events. Surrounded by lush tea gardens and overlooking the sacred city, every event becomes an unforgettable journey with colonial charm and modern comforts.',
    basePrice:3500, capacity:300,
    images:['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=85','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85','https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=85','https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=1200&q=85'],
    image360:'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=2400&q=85',
    amenities:['Garden Pavilion','Tea Garden Views','Heritage Spa','Traditional Cuisine','Cultural Shows','Bonfire Terrace','Nature Walks'] },
  'sample-3':{ _id:'sample-3', name:'Galle Fort Palace', location:'Galle, Sri Lanka',
    description:'A colonial masterpiece within the UNESCO World Heritage-listed Galle Fort. The cobblestone courtyards and Dutch colonial architecture create a breathtaking backdrop for intimate gatherings and milestone celebrations steeped in centuries of history.',
    basePrice:4200, capacity:200,
    images:['https://images.unsplash.com/photo-1537639622086-7d0ad12e1fbb?w=1200&q=85','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85','https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1200&q=85','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85'],
    image360:'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=2400&q=85',
    amenities:['Stone Courtyard','Ocean Terrace','Colonial Ballroom','Fort Views','Sunset Deck','Heritage Library','Candlelit Dining'] },
  'sample-4':{ _id:'sample-4', name:'Mirissa Oceanfront Estate', location:'Mirissa, Sri Lanka',
    description:'A contemporary beachfront venue where the Indian Ocean meets luxury. Perfect for beach weddings, corporate retreats, and sunset galas under a canopy of stars with the rhythm of waves as your soundtrack.',
    basePrice:6000, capacity:400,
    images:['https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=1200&q=85','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85','https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85'],
    image360:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2400&q=85',
    amenities:['Private Beach','Infinity Pool','Beach Bar','Sunset Deck','Water Sports','Fine Dining','Whale Watching','Bonfire Pit'] },
};

const ALL_MENU: MenuItem[] = [
  {_id:'m1',name:'Coconut Prawn Skewers',description:'Grilled tiger prawns with fresh coconut marinade, lime wedge and chilli dip',pricePerPlate:18,category:'appetizer',image:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80'},
  {_id:'m2',name:'Sri Lankan Bruschetta',description:'Toasted artisan bread with fresh tomato, red onion, and green chilli sambol',pricePerPlate:12,category:'appetizer',image:'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&q=80'},
  {_id:'m3',name:'Crab Cakes',description:'Pan-seared blue swimmer crab cakes with spiced mango aioli and micro herbs',pricePerPlate:22,category:'appetizer',image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'},
  {_id:'m4',name:'Saffron Chicken Biryani',description:'Fragrant basmati rice with tender chicken, saffron threads, and caramelised onions',pricePerPlate:35,category:'main',image:'https://images.unsplash.com/photo-1563379091339-03246963d96d?w=500&q=80'},
  {_id:'m5',name:'Grilled Sea Bass',description:'Whole sea bass with ginger, garlic and herb crust, served with coconut rice',pricePerPlate:48,category:'main',image:'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500&q=80'},
  {_id:'m6',name:'Lamb Kottu Roti',description:'Traditional Sri Lankan kottu with slow-cooked lamb, vegetables and egg',pricePerPlate:30,category:'main',image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80'},
  {_id:'m7',name:'Vegetarian Dhal Curry',description:'Creamy red lentil curry with tempered spices, served with hoppers',pricePerPlate:20,category:'main',image:'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80'},
  {_id:'m8',name:'Watalappan Custard',description:'Traditional jaggery coconut custard topped with cashews and cardamom',pricePerPlate:14,category:'dessert',image:'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80'},
  {_id:'m9',name:'Mango Pannacotta',description:'Silky cream dessert with fresh Alphonso mango coulis and mint',pricePerPlate:16,category:'dessert',image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80'},
  {_id:'m10',name:'Ceylon Tea Service',description:'Premium single-estate high-grown Ceylon tea with milk, honey, and biscuits',pricePerPlate:8,category:'beverage',image:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80'},
  {_id:'m11',name:'Tropical Juice Station',description:'King coconut, passion fruit, mango and pineapple fresh-pressed juices',pricePerPlate:10,category:'beverage',image:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80'},
];

const DJ_PACKAGES: DJPackage[] = [
  { _id:'dj1', name:'Essential Beats', price:350, duration:'4 Hours',
    description:'Perfect for smaller celebrations. Professional sound system with a curated playlist.',
    features:['Professional Sound System','4hr DJ Performance','Background & Dance Music','Basic Lighting Rig','MC Announcements'] },
  { _id:'dj2', name:'Premium Party', price:650, duration:'6 Hours', popular:true,
    description:'Our most popular package — full dance floor experience with lights and effects.',
    features:['Premium Sound System','6hr DJ Performance','Full Dance Floor Lighting','Smoke & Haze Effects','MC Announcements','Custom Playlist Consultation','Wireless Microphone'] },
  { _id:'dj3', name:'Grand Celebration', price:1100, duration:'8 Hours',
    description:'The ultimate event experience — concert-grade audio, full light show, and live effects.',
    features:['Concert-Grade Sound','8hr DJ Performance','Full LED Light Show','Laser & Strobe Effects','Fog Machine','Live Mixer & Scratching','Dedicated Sound Engineer','MC & Crowd Hosting','Custom Event Intro'] },
];

const EVENT_TYPES = [
  { id:'wedding',    label:'Wedding',          icon:Heart,      color:'#f472b6' },
  { id:'birthday',   label:'Birthday Party',   icon:Cake,       color:'#a78bfa' },
  { id:'corporate',  label:'Corporate Event',  icon:Briefcase,  color:'#38bdf8' },
  { id:'concert',    label:'Concert / Gala',   icon:Mic2,       color:'#fb923c' },
  { id:'other',      label:'Other Event',      icon:PartyPopper,color:'#34d399' },
];

const CATS = [
  {key:'appetizer',label:'Appetisers', icon:Salad,    color:'#10b981'},
  {key:'main',     label:'Main Course',icon:Utensils, color:'#d97706'},
  {key:'dessert',  label:'Desserts',   icon:IceCream, color:'#ec4899'},
  {key:'beverage', label:'Beverages',  icon:Wine,     color:'#38bdf8'},
] as const;

const CAT_FALLBACK:Record<string,string> = {
  appetizer:'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=500&q=80',
  main:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
  dessert:'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80',
  beverage:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',
};

/* ─────────────────────── HELPERS ─────────────────────── */
function fmtCard(v:string){ return v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim(); }
function fmtExp(v:string){ return v.replace(/\D/g,'').slice(0,4).replace(/^(\d{2})(\d)/,'$1/$2'); }
function detectBrand(n:string){
  const d=n.replace(/\s/g,'');
  if(/^4/.test(d)) return 'VISA';
  if(/^5[1-5]/.test(d)||/^2[2-7]/.test(d)) return 'MC';
  if(/^3[47]/.test(d)) return 'AMEX';
  return '';
}

/* ══════════════════════ PAGE ══════════════════════ */
export default function HotelPage({params}:{params:Promise<{id:string}>}){
  const {id} = use(params);

  const [hotel,    setHotel]     = useState<Hotel|null>(null);
  const [menuItems,setMenuItems] = useState<MenuItem[]>([]);
  const [dataLoad, setDataLoad]  = useState(true);

  useEffect(()=>{
    (async()=>{
      try{
        // Always try DB first
        const [h,m]=await Promise.all([
          fetch(`/api/hotels/${id}`).then(r=>r.ok?r.json():null),
          fetch(`/api/menu-items?hotelId=${id}`).then(r=>r.ok?r.json():[]),
        ]);
        if(h){
          setHotel(h);
          setMenuItems(m.length ? m : ALL_MENU);
        } else {
          // Fallback to sample data for demo
          const sample = ALL_HOTELS[id] || null;
          setHotel(sample);
          setMenuItems(ALL_MENU);
        }
      } catch {
        const sample = ALL_HOTELS[id] || null;
        setHotel(sample);
        setMenuItems(ALL_MENU);
      } finally { setDataLoad(false); }
    })();
  },[id]);

  /* ── UI tabs ── */
  const [photoTab,  setPhotoTab]  = useState<'gallery'|'tour'>('gallery');
  const [menuTab,   setMenuTab]   = useState('appetizer');
  const [lightbox,  setLightbox]  = useState<number|null>(null);

  /* ── Booking wizard: 4 steps ── */
  const STEPS = ['event','menu','addons','payment'] as const;
  type Step = typeof STEPS[number];
  const [step, setStep] = useState<Step>('event');
  const stepIdx = STEPS.indexOf(step);

  /* Step 1 – event */
  const [eventType, setEventType] = useState('');
  const [guests,    setGuests]    = useState(50);
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState(''); // e.g. "Sarah & Tom's Wedding"

  /* Step 2 – menu */
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<string>>(new Set());

  /* Step 3 – DJ add-ons */
  const [selectedDJ, setSelectedDJ] = useState<string|null>(null);

  /* Step 4 – payment */
  const [guestName,  setGuestName]  = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [requests,   setRequests]   = useState('');
  const [cardNum,    setCardNum]    = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardExp,    setCardExp]    = useState('');
  const [cardCvv,    setCardCvv]    = useState('');
  const [cvvShow,    setCvvShow]    = useState(false);
  const [paying,     setPaying]     = useState(false);
  const [payError,   setPayError]   = useState('');
  const [bookRef,    setBookRef]    = useState('');
  const [done,       setDone]       = useState(false);

  /* ── calculations ── */
  const pickedItems = useMemo(()=>menuItems.filter(m=>selectedMenuIds.has(m._id)),[menuItems,selectedMenuIds]);
  const menuTotal   = useMemo(()=>pickedItems.reduce((s,m)=>s+m.pricePerPlate*guests,0),[pickedItems,guests]);
  const djPackage   = DJ_PACKAGES.find(d=>d._id===selectedDJ);
  const djTotal     = djPackage?.price||0;
  const venueRent   = hotel?.basePrice||0;
  const grandTotal  = venueRent+menuTotal+djTotal;

  const toggleMenu=(id:string)=>setSelectedMenuIds(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});

  const tomorrow=new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const minDate=tomorrow.toISOString().split('T')[0];

  /* ── demo payment ── */
  const handlePay=async()=>{
    setPayError('');
    const raw=cardNum.replace(/\s/g,'');
    if(raw.length<16){setPayError('Please enter a valid 16-digit card number.');return;}
    if(cardExp.length<5){setPayError('Please enter a valid expiry date (MM/YY).');return;}
    if(cardCvv.length<3){setPayError('CVV must be 3 digits.');return;}
    if(!guestName||!guestEmail||!guestPhone){setPayError('Please fill all contact fields.');return;}
    if(!eventDate){setPayError('Please select an event date.');return;}
    setPaying(true);
    await new Promise(r=>setTimeout(r,2200)); // simulate processing
    try{
      const res=await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({hotelId:id,guestName,guestEmail,guestPhone,eventDate,guestCount:guests,
          selectedMenuItems:pickedItems.map(m=>({menuItemId:m._id,name:m.name,pricePerPlate:m.pricePerPlate})),
          basePrice:venueRent,totalPrice:grandTotal,specialRequests:requests})});
      const b=res.ok?await res.json():{_id:'REF'+Date.now()};
      setBookRef(('CEL-'+b._id.toString().slice(-6)).toUpperCase());
    }catch{setBookRef('CEL-'+Math.random().toString(36).slice(-6).toUpperCase());}
    setPaying(false);
    setDone(true);
  };

  /* brand icon */
  const brand=detectBrand(cardNum);

  /* colours */
  const C={amber:'#d97706',bg:'#0c0a09',card:'#1c1917',border:'#292524',muted:'#a8a29e',dim:'#57534e',green:'#10b981'};
  const inp:React.CSSProperties={width:'100%',background:'#111110',border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px',color:'#f5f5f4',fontSize:14,fontFamily:'inherit',outline:'none',transition:'border-color 0.2s'};
  const lbl:React.CSSProperties={color:C.dim,fontSize:11,fontWeight:700,letterSpacing:'0.15em',display:'block',marginBottom:7};

  if(dataLoad) return(
    <div style={{background:C.bg,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Loader2 style={{width:40,height:40,color:C.amber,animation:'spin 1s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if(!hotel) return(
    <div style={{background:C.bg,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <p style={{color:C.muted,fontSize:18}}>Hotel not found.</p>
      <Link href="/" style={{color:C.amber,fontSize:14,textDecoration:'none'}}>← Back to venues</Link>
    </div>
  );

  return(
  <div style={{background:C.bg,minHeight:'100vh',color:'#f5f5f4'}}>
  <style>{`
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .fade{animation:fadeUp 0.35s ease}
    .img-hz img{transition:transform 0.6s ease}
    .img-hz:hover img{transform:scale(1.05)}
    .ptab,.mtab,.etab{border:none;cursor:pointer;font-family:inherit;transition:all 0.2s}
    .btn-amber{border:none;cursor:pointer;font-family:inherit;border-radius:12px;padding:14px;font-size:13px;font-weight:900;letter-spacing:0.12em;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;transition:all 0.2s;background:#d97706;color:#0c0a09}
    .btn-amber:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 8px 24px rgba(217,119,6,0.4)}
    .btn-amber:disabled{background:#292524;color:#57534e;cursor:not-allowed;transform:none;box-shadow:none}
    .btn-ghost{border:1px solid #292524;cursor:pointer;font-family:inherit;border-radius:10px;padding:9px 18px;color:#a8a29e;font-size:13px;font-weight:700;background:transparent;letter-spacing:0.08em;transition:all 0.2s}
    .btn-ghost:hover{border-color:#d97706;color:#d97706}
    .mcard{border-radius:12px;overflow:hidden;display:flex;transition:all 0.2s ease;cursor:pointer}
    .mcard:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.5)}
    .sitem{border-radius:10px;cursor:pointer;display:flex;align-items:center;overflow:hidden;border-width:1px;border-style:solid;background:#111110;width:100%;transition:all 0.2s}
    .sitem:hover{border-color:#92400e !important}
    .dj-card{border-radius:14px;cursor:pointer;border:1px solid #292524;background:#111110;transition:all 0.22s ease;overflow:hidden}
    .dj-card:hover{border-color:#92400e;transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.5)}
    .etab{border-radius:12px;padding:12px 10px;display:flex;flex-direction:column;align-items:center;gap:6px;border:1px solid #292524;background:#111110}
    .etab:hover{border-color:#92400e}
    input:focus,textarea:focus,select:focus{border-color:#d97706 !important;box-shadow:0 0 0 3px rgba(217,119,6,0.1) !important}
    textarea{resize:none}
    .card-input{background:#111110;border:1px solid #292524;border-radius:10px;padding:12px 14px;color:#f5f5f4;font-size:15px;font-family:'Courier New',monospace;outline:none;width:100%;transition:border-color 0.2s;letter-spacing:0.08em}
    .card-input:focus{border-color:#d97706 !important;box-shadow:0 0 0 3px rgba(217,119,6,0.1) !important}
    .step-bar-fill{transition:width 0.5s ease}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:#1c1917}
    ::-webkit-scrollbar-thumb{background:#44403c;border-radius:4px}
    @media(max-width:960px){.two-col{grid-template-columns:1fr !important}.sticky-r{position:static !important}}
    @media(max-width:600px){.hero-h{height:340px !important}.tstripw{display:none !important}}
  `}</style>

  {/* ═══ HERO ═══ */}
  <div className="hero-h" style={{position:'relative',height:500,overflow:'hidden'}}>
    <img src={hotel.images[0]} alt={hotel.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(12,10,9,0.5) 0%,rgba(12,10,9,0.1) 40%,rgba(12,10,9,1) 100%)'}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(12,10,9,0.55),transparent 60%)'}}/>

    <div style={{position:'absolute',top:22,left:22}}>
      <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(12,10,9,0.75)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:50,padding:'8px 18px',color:'#e7e5e4',fontSize:13,fontWeight:700,textDecoration:'none'}}>
        <ArrowLeft style={{width:15,height:15}}/> All Venues
      </Link>
    </div>

    <div className="tstripw" style={{position:'absolute',top:22,right:22,display:'flex',gap:8}}>
      {hotel.images.slice(1,5).map((img,i)=>(
        <button key={i} onClick={()=>setLightbox(i+1)} style={{width:72,height:54,borderRadius:8,overflow:'hidden',border:'2px solid rgba(255,255,255,0.18)',cursor:'pointer',padding:0,background:'none'}}>
          <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </button>
      ))}
    </div>

    <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'0 28px 32px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(217,119,6,0.18)',border:'1px solid rgba(217,119,6,0.4)',borderRadius:50,padding:'5px 14px',marginBottom:14}}>
          <MapPin style={{width:12,height:12,color:C.amber}}/><span style={{color:'#fbbf24',fontSize:11,fontWeight:700,letterSpacing:'0.15em'}}>{hotel.location}</span>
        </div>
        <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'clamp(28px,4vw,56px)',color:'#fafaf9',lineHeight:1.1,marginBottom:14,fontWeight:600}}>{hotel.name}</h1>
        <div style={{display:'flex',flexWrap:'wrap',gap:18,alignItems:'center'}}>
          <span style={{display:'flex',alignItems:'center',gap:7,color:'#e7e5e4',fontSize:14}}><Users style={{width:15,height:15,color:C.amber}}/>Up to {hotel.capacity.toLocaleString()} guests</span>
          <span style={{display:'flex',alignItems:'center',gap:7,color:'#fbbf24',fontSize:14}}><Star style={{width:15,height:15,fill:C.amber,color:C.amber}}/>Premium Venue</span>
          <span style={{background:'rgba(217,119,6,0.15)',border:'1px solid rgba(217,119,6,0.35)',borderRadius:50,padding:'5px 16px',color:'#fbbf24',fontSize:13,fontWeight:700}}>Events Only · No Stay</span>
        </div>
      </div>
    </div>
  </div>

  {/* ═══ BODY ═══ */}
  <div style={{maxWidth:1200,margin:'0 auto',padding:'36px 20px 60px',display:'grid',gridTemplateColumns:'1fr 390px',gap:28,alignItems:'start'}} className="two-col">

    {/* ─── LEFT ─── */}
    <div style={{display:'flex',flexDirection:'column',gap:28}}>

      {/* PHOTOS */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'14px 20px',borderBottom:`1px solid ${C.border}`,background:'#111110'}}>
          <Sparkles style={{width:14,height:14,color:C.amber,marginRight:4}}/>
          {(['gallery','tour'] as const).map(t=>(
            <button key={t} className="ptab" onClick={()=>setPhotoTab(t)}
              style={{borderRadius:10,padding:'7px 16px',fontSize:13,fontWeight:700,letterSpacing:'0.06em',color:photoTab===t?C.amber:C.dim,background:photoTab===t?'rgba(217,119,6,0.12)':'transparent',border:`1px solid ${photoTab===t?'rgba(217,119,6,0.35)':'transparent'}`}}>
              {t==='gallery'?'📸 Photo Gallery':'🌐 360° Virtual Tour'}
            </button>
          ))}
        </div>
        {photoTab==='gallery'
          ? <Gallery images={hotel.images} name={hotel.name} onLightbox={setLightbox}/>
          : <Tour360 url={hotel.image360||hotel.images[0]}/>
        }
      </div>

      {/* ABOUT */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:'26px 28px'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'#fafaf9',fontWeight:600,marginBottom:12}}>About This Venue</h2>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 14px',marginBottom:14}}>
          <PartyPopper style={{width:14,height:14,color:'#fbbf24'}}/>
          <span style={{color:'#fbbf24',fontSize:12,fontWeight:600}}>Events Only — Weddings, Birthdays, Galas, Corporate & More. No accommodation.</span>
        </div>
        <p style={{color:C.muted,lineHeight:1.85,fontSize:14,marginBottom:20}}>{hotel.description}</p>
        {hotel.amenities&&hotel.amenities.length>0&&(
          <>
            <p style={{color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.2em',marginBottom:14}}>AMENITIES & FACILITIES</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:10}}>
              {hotel.amenities.map(a=>(
                <div key={a} style={{display:'flex',alignItems:'center',gap:10,background:'#111110',border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px'}}>
                  <Check style={{width:13,height:13,color:C.amber,flexShrink:0}}/><span style={{color:'#d6d3d1',fontSize:13}}>{a}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FULL MENU SHOWCASE */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,overflow:'hidden'}}>
        <div style={{padding:'22px 26px 0'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
            <ChefHat style={{width:17,height:17,color:C.amber}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:21,color:'#fafaf9',fontWeight:600}}>Culinary Menu</h2>
            <span style={{marginLeft:'auto',color:C.dim,fontSize:13}}>{menuItems.length} dishes</span>
          </div>
          <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:6}}>
            {CATS.map(({key,label,icon:Icon,color})=>{
              const n=menuItems.filter(m=>m.category===key).length;
              const act=menuTab===key;
              return(
                <button key={key} className="mtab" onClick={()=>setMenuTab(key)}
                  style={{borderRadius:9,padding:'7px 14px',fontSize:12,fontWeight:700,letterSpacing:'0.07em',color:act?color:C.dim,background:act?`${color}18`:'transparent',border:`1px solid ${act?`${color}44`:C.border}`,whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:5}}>
                  <Icon style={{width:13,height:13}}/>{label}
                  <span style={{background:act?`${color}30`:'#111110',borderRadius:50,padding:'1px 7px',fontSize:10,color:act?color:C.dim}}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{padding:'18px 26px 26px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(255px,1fr))',gap:13}} className="fade">
            {menuItems.filter(m=>m.category===menuTab).map(item=>(
              <div key={item._id} className="mcard img-hz" style={{border:`1px solid ${C.border}`}}>
                <div style={{width:95,flexShrink:0,overflow:'hidden'}}>
                  <img src={item.image||CAT_FALLBACK[item.category]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                </div>
                <div style={{flex:1,padding:'14px 15px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                  <div>
                    <p style={{color:'#e7e5e4',fontWeight:700,fontSize:14,marginBottom:4,lineHeight:1.3}}>{item.name}</p>
                    <p style={{color:C.dim,fontSize:12,lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.description}</p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                    <span style={{color:C.amber,fontWeight:900,fontSize:16}}>${item.pricePerPlate}</span>
                    <span style={{color:C.dim,fontSize:11}}>per plate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DJ PACKAGES SHOWCASE */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,overflow:'hidden'}}>
        <div style={{padding:'22px 26px',borderBottom:`1px solid ${C.border}`,background:'linear-gradient(135deg,#111110,#1a0f05)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <Music2 style={{width:18,height:18,color:C.amber}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:21,color:'#fafaf9',fontWeight:600}}>DJ & Entertainment Packages</h2>
            <span style={{marginLeft:'auto',background:'rgba(217,119,6,0.15)',border:'1px solid rgba(217,119,6,0.3)',borderRadius:50,padding:'3px 12px',color:'#fbbf24',fontSize:11,fontWeight:700}}>OPTIONAL ADD-ON</span>
          </div>
          <p style={{color:C.dim,fontSize:13,marginTop:8}}>Elevate your event with professional DJ & sound. Add any package during booking.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16,padding:'22px 26px'}}>
          {DJ_PACKAGES.map(pkg=>(
            <div key={pkg._id} className="dj-card">
              {pkg.popular&&<div style={{background:C.amber,color:'#0c0a09',fontSize:10,fontWeight:900,letterSpacing:'0.15em',textAlign:'center',padding:'5px'}}>★ MOST POPULAR</div>}
              <div style={{padding:'18px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                  <div>
                    <p style={{color:'#e7e5e4',fontWeight:700,fontSize:15,marginBottom:2}}>{pkg.name}</p>
                    <p style={{color:C.dim,fontSize:12}}>{pkg.duration}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{color:C.amber,fontWeight:900,fontSize:20}}>${pkg.price}</p>
                    <p style={{color:C.dim,fontSize:11}}>flat rate</p>
                  </div>
                </div>
                <p style={{color:C.muted,fontSize:12,lineHeight:1.6,marginBottom:12}}>{pkg.description}</p>
                <div style={{display:'flex',flexDirection:'column',gap:5}}>
                  {pkg.features.map(f=>(
                    <div key={f} style={{display:'flex',alignItems:'center',gap:7}}>
                      <Check style={{width:12,height:12,color:C.green,flexShrink:0}}/><span style={{color:'#d6d3d1',fontSize:12}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ─── RIGHT: BOOKING WIZARD ─── */}
    <div className="sticky-r" style={{position:'sticky',top:82}}>
      {done ? <BookingSuccess ref_={bookRef} hotel={hotel} guests={guests} eventType={eventType} eventDate={eventDate} eventName={eventName} items={pickedItems} dj={djPackage||null} venueRent={venueRent} menuTotal={menuTotal} djTotal={djTotal} grand={grandTotal} C={C} /> : (
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,overflow:'hidden'}}>

        {/* wizard header */}
        <div style={{padding:'18px 22px',borderBottom:`1px solid ${C.border}`,background:'linear-gradient(135deg,#1a0f05,#1c1917)'}}>
          <p style={{color:C.amber,fontSize:10,fontWeight:700,letterSpacing:'0.22em',marginBottom:4}}>EVENT BOOKING WIZARD</p>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#fafaf9',fontWeight:600}}>{hotel.name}</p>
          {/* step progress bar */}
          <div style={{marginTop:14}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              {(['Event','Menu','DJ','Payment'] as string[]).map((s,i)=>(
                <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,
                    background:i<stepIdx?C.green:i===stepIdx?C.amber:'#292524',
                    color:i<=stepIdx?'#0c0a09':C.dim,transition:'all 0.3s'}}>
                    {i<stepIdx?'✓':i+1}
                  </div>
                  <span style={{fontSize:9,fontWeight:700,letterSpacing:'0.1em',color:i===stepIdx?C.amber:i<stepIdx?C.green:C.dim}}>{s.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div style={{height:3,background:'#292524',borderRadius:2,overflow:'hidden'}}>
              <div className="step-bar-fill" style={{height:'100%',background:`linear-gradient(to right,${C.green},${C.amber})`,width:`${(stepIdx/3)*100}%`,borderRadius:2}}/>
            </div>
          </div>
        </div>

        {/* live cost strip */}
        <div style={{padding:'12px 22px',background:'#111110',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <TrendingUp style={{width:13,height:13,color:C.amber}}/>
            <span style={{color:C.dim,fontSize:11,fontWeight:700,letterSpacing:'0.12em'}}>RUNNING TOTAL</span>
          </div>
          <span style={{color:C.amber,fontWeight:900,fontSize:22,fontFamily:"'Playfair Display',serif"}}>${grandTotal.toLocaleString()}</span>
        </div>

        <div style={{padding:'18px 22px',display:'flex',flexDirection:'column',gap:18}}>

          {/* ══ STEP 1: EVENT ══ */}
          {step==='event'&&(
          <div className="fade">
            <p style={{...lbl,color:C.amber}}>WHAT TYPE OF EVENT?</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginBottom:18}}>
              {EVENT_TYPES.map(({id:eid,label,icon:Icon,color})=>(
                <button key={eid} className="etab" onClick={()=>setEventType(eid)}
                  style={{border:`1px solid ${eventType===eid?color:'#292524'}`,background:eventType===eid?`${color}15`:'#111110',color:eventType===eid?color:C.dim}}>
                  <Icon style={{width:18,height:18}}/>
                  <span style={{fontSize:10,fontWeight:700,textAlign:'center',lineHeight:1.2}}>{label}</span>
                </button>
              ))}
            </div>

            <div style={{marginBottom:14}}>
              <label style={lbl}>EVENT NAME</label>
              <input placeholder="e.g. Sarah & Tom's Wedding" value={eventName} onChange={e=>setEventName(e.target.value)} style={inp}/>
            </div>

            <div style={{marginBottom:14}}>
              <label style={lbl}>SELECT EVENT DATE *</label>
              <AvailabilityCalendar hotelId={id} selectedDate={eventDate} onSelectDate={setEventDate}/>
              {eventDate && (
                <div style={{marginTop:10,display:'flex',alignItems:'center',gap:8,background:'rgba(217,119,6,0.08)',border:'1px solid rgba(217,119,6,0.25)',borderRadius:10,padding:'9px 12px'}}>
                  <Calendar style={{width:13,height:13,color:C.amber,flexShrink:0}}/>
                  <span style={{color:'#fbbf24',fontSize:13,fontWeight:700}}>
                    {new Date(eventDate+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
                  </span>
                </div>
              )}
            </div>

            <div style={{marginBottom:18}}>
              <label style={lbl}>NUMBER OF GUESTS</label>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                <button onClick={()=>setGuests(g=>Math.max(10,g-10))} style={{width:36,height:36,borderRadius:9,background:'#111110',border:`1px solid ${C.border}`,color:C.amber,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Minus style={{width:14,height:14}}/>
                </button>
                <div style={{flex:1,textAlign:'center'}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:32,color:'#fafaf9',fontWeight:600}}>{guests}</span>
                  <span style={{color:C.dim,fontSize:12,marginLeft:6}}>guests</span>
                </div>
                <button onClick={()=>setGuests(g=>Math.min(hotel.capacity,g+10))} style={{width:36,height:36,borderRadius:9,background:'#111110',border:`1px solid ${C.border}`,color:C.amber,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Plus style={{width:14,height:14}}/>
                </button>
              </div>
              <input type="range" min={10} max={hotel.capacity} step={5} value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{width:'100%',accentColor:C.amber}}/>
              <div style={{display:'flex',justifyContent:'space-between',color:C.dim,fontSize:10,marginTop:4}}><span>10</span><span>max {hotel.capacity}</span></div>
            </div>

            <CostLine label="Venue Rental" amount={venueRent} C={C}/>
            <button className="btn-amber" disabled={!eventDate||!eventType} onClick={()=>setStep('menu')}>
              NEXT: SELECT MENU →
            </button>
          </div>
          )}

          {/* ══ STEP 2: MENU ══ */}
          {step==='menu'&&(
          <div className="fade">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <p style={{...lbl,color:C.amber,margin:0}}>BUILD YOUR MENU</p>
              <button className="btn-ghost" style={{padding:'5px 12px',fontSize:11}} onClick={()=>setStep('event')}>← Back</button>
            </div>
            <p style={{color:C.dim,fontSize:12,marginBottom:14}}>${menuItems.find(Boolean)?.pricePerPlate??0}–$48 per plate · {guests} guests</p>

            {/* mini tabs */}
            <div style={{display:'flex',gap:4,marginBottom:12,overflowX:'auto'}}>
              {CATS.map(({key,label,icon:Icon,color})=>{
                const sel=menuItems.filter(m=>m.category===key&&selectedMenuIds.has(m._id)).length;
                const act=menuTab===key;
                return(
                  <button key={key} onClick={()=>setMenuTab(key)} className="mtab"
                    style={{borderRadius:9,padding:'6px 12px',fontSize:11,fontWeight:700,color:act?color:C.dim,background:act?`${color}18`:'transparent',border:`1px solid ${act?`${color}44`:C.border}`,position:'relative',flexShrink:0,display:'flex',alignItems:'center',gap:5}}>
                    <Icon style={{width:12,height:12}}/>{label}
                    {sel>0&&<span style={{background:color,color:'#0c0a09',borderRadius:50,padding:'0 5px',fontSize:9,fontWeight:900}}>{sel}</span>}
                  </button>
                );
              })}
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:7,maxHeight:280,overflowY:'auto',paddingRight:2}}>
              {menuItems.filter(m=>m.category===menuTab).map(item=>{
                const sel=selectedMenuIds.has(item._id);
                return(
                  <button key={item._id} className="sitem" onClick={()=>toggleMenu(item._id)}
                    style={{borderColor:sel?C.amber:C.border}}>
                    <div style={{width:52,height:52,flexShrink:0,overflow:'hidden'}}>
                      <img src={item.image||CAT_FALLBACK[item.category]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    </div>
                    <div style={{flex:1,padding:'8px 11px',textAlign:'left'}}>
                      <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}>
                        {sel&&<CheckCircle2 style={{width:12,height:12,color:C.amber,flexShrink:0}}/>}
                        <span style={{color:sel?'#fbbf24':'#d6d3d1',fontSize:13,fontWeight:700}}>{item.name}</span>
                      </div>
                      <p style={{color:C.dim,fontSize:11,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical'}}>{item.description}</p>
                    </div>
                    <div style={{padding:'0 12px',textAlign:'right',flexShrink:0}}>
                      <p style={{color:C.amber,fontWeight:900,fontSize:14}}>${item.pricePerPlate}</p>
                      {sel&&<p style={{color:C.dim,fontSize:10}}>${(item.pricePerPlate*guests).toLocaleString()}</p>}
                    </div>
                  </button>
                );
              })}
            </div>

            {pickedItems.length>0&&(
              <div style={{marginTop:14,background:'#111110',border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px'}}>
                <p style={{color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.15em',marginBottom:8}}>MENU SUBTOTAL</p>
                {pickedItems.map(m=><CostLine key={m._id} label={`${m.name} ×${guests}`} amount={m.pricePerPlate*guests} sub C={C}/>)}
                <div style={{borderTop:`1px solid ${C.border}`,marginTop:8,paddingTop:8}}>
                  <CostLine label="Menu total" amount={menuTotal} C={C}/>
                </div>
              </div>
            )}
            <button className="btn-amber" style={{marginTop:14}} onClick={()=>setStep('addons')}>
              NEXT: DJ & EXTRAS →
            </button>
          </div>
          )}

          {/* ══ STEP 3: DJ ══ */}
          {step==='addons'&&(
          <div className="fade">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <p style={{...lbl,color:C.amber,margin:0}}>DJ & ENTERTAINMENT</p>
              <button className="btn-ghost" style={{padding:'5px 12px',fontSize:11}} onClick={()=>setStep('menu')}>← Back</button>
            </div>
            <p style={{color:C.dim,fontSize:12,marginBottom:16}}>Optional add-on — skip if not needed.</p>

            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {/* no DJ */}
              <button onClick={()=>setSelectedDJ(null)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:11,border:`1px solid ${!selectedDJ?C.amber:C.border}`,background:!selectedDJ?'rgba(217,119,6,0.08)':'#111110',cursor:'pointer',textAlign:'left',transition:'all 0.2s'}}>
                <div style={{width:32,height:32,borderRadius:8,background:'#292524',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <X style={{width:15,height:15,color:C.dim}}/>
                </div>
                <div>
                  <p style={{color:!selectedDJ?'#fbbf24':'#d6d3d1',fontWeight:700,fontSize:13}}>No DJ / Entertainment</p>
                  <p style={{color:C.dim,fontSize:11}}>We'll handle our own music or use venue audio</p>
                </div>
                {!selectedDJ&&<CheckCircle2 style={{width:16,height:16,color:C.amber,marginLeft:'auto'}}/>}
              </button>

              {DJ_PACKAGES.map(pkg=>(
                <button key={pkg._id} onClick={()=>setSelectedDJ(pkg._id)}
                  style={{display:'flex',alignItems:'flex-start',gap:12,padding:'14px',borderRadius:11,border:`1px solid ${selectedDJ===pkg._id?C.amber:pkg.popular?'rgba(217,119,6,0.3)':C.border}`,background:selectedDJ===pkg._id?'rgba(217,119,6,0.1)':pkg.popular?'rgba(217,119,6,0.04)':'#111110',cursor:'pointer',textAlign:'left',transition:'all 0.2s',position:'relative',overflow:'hidden'}}>
                  {pkg.popular&&<div style={{position:'absolute',top:0,right:0,background:C.amber,color:'#0c0a09',fontSize:9,fontWeight:900,padding:'3px 8px',borderRadius:'0 0 0 8px'}}>POPULAR</div>}
                  <div style={{width:36,height:36,borderRadius:9,background:'rgba(217,119,6,0.15)',border:'1px solid rgba(217,119,6,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                    <Music2 style={{width:16,height:16,color:C.amber}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:3}}>
                      <p style={{color:selectedDJ===pkg._id?'#fbbf24':'#e7e5e4',fontWeight:700,fontSize:14}}>{pkg.name}</p>
                      <span style={{color:C.amber,fontWeight:900,fontSize:15,marginLeft:8,flexShrink:0}}>${pkg.price}</span>
                    </div>
                    <p style={{color:C.dim,fontSize:11,marginBottom:6}}>{pkg.duration} · {pkg.description.slice(0,60)}…</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      {pkg.features.slice(0,3).map(f=>(
                        <span key={f} style={{background:'#292524',borderRadius:50,padding:'2px 8px',fontSize:10,color:'#a8a29e'}}>{f}</span>
                      ))}
                      {pkg.features.length>3&&<span style={{background:'#292524',borderRadius:50,padding:'2px 8px',fontSize:10,color:C.dim}}>+{pkg.features.length-3} more</span>}
                    </div>
                  </div>
                  {selectedDJ===pkg._id&&<CheckCircle2 style={{width:16,height:16,color:C.amber,flexShrink:0,marginTop:2}}/>}
                </button>
              ))}
            </div>

            {selectedDJ&&(
              <div style={{marginTop:14,background:'#111110',border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px'}}>
                <CostLine label="Venue Rental" amount={venueRent} C={C}/>
                <CostLine label={`Menu (${pickedItems.length} items ×${guests})`} amount={menuTotal} sub C={C}/>
                <CostLine label={`${djPackage?.name} DJ`} amount={djTotal} sub C={C}/>
                <div style={{borderTop:`1px solid ${C.border}`,marginTop:8,paddingTop:8}}>
                  <CostLine label="Grand Total" amount={grandTotal} bold C={C}/>
                </div>
              </div>
            )}

            <button className="btn-amber" style={{marginTop:14}} onClick={()=>setStep('payment')}>
              NEXT: PAYMENT →
            </button>
          </div>
          )}

          {/* ══ STEP 4: PAYMENT ══ */}
          {step==='payment'&&(
          <div className="fade" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:2}}>
              <p style={{...lbl,color:C.amber,margin:0}}>CONTACT DETAILS</p>
              <button className="btn-ghost" style={{padding:'5px 12px',fontSize:11}} onClick={()=>setStep('addons')}>← Back</button>
            </div>
            <div><label style={lbl}>FULL NAME *</label><input type="text" placeholder="Kasun Perera" value={guestName} onChange={e=>setGuestName(e.target.value)} style={inp}/></div>
            <div><label style={lbl}>EMAIL ADDRESS *</label><input type="email" placeholder="kasun@example.com" value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} style={inp}/></div>
            <div><label style={lbl}>PHONE *</label><input type="tel" placeholder="+94 77 123 4567" value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} style={inp}/></div>
            <div><label style={lbl}>SPECIAL REQUESTS</label><textarea rows={2} placeholder="Dietary, décor, AV notes…" value={requests} onChange={e=>setRequests(e.target.value)} style={inp}/></div>

            {/* CARD PAYMENT */}
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginTop:2}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <CreditCard style={{width:15,height:15,color:C.amber}}/>
                <p style={{...lbl,margin:0,color:C.amber}}>CARD PAYMENT (DEMO)</p>
                <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:4,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:50,padding:'3px 10px'}}>
                  <Lock style={{width:10,height:10,color:C.green}}/><span style={{color:C.green,fontSize:10,fontWeight:700}}>DEMO MODE</span>
                </div>
              </div>

              {/* card visual */}
              <div style={{background:'linear-gradient(135deg,#1a1410,#2d1f0a)',border:'1px solid rgba(217,119,6,0.3)',borderRadius:14,padding:'20px 22px',marginBottom:16,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:'rgba(217,119,6,0.06)'}}/>
                <div style={{position:'absolute',bottom:-30,left:60,width:90,height:90,borderRadius:'50%',background:'rgba(217,119,6,0.04)'}}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
                  <div style={{display:'flex',gap:4}}>
                    <div style={{width:28,height:20,borderRadius:4,background:'rgba(217,119,6,0.6)'}}/>
                    <div style={{width:28,height:20,borderRadius:4,background:'rgba(217,119,6,0.35)',marginLeft:-10}}/>
                  </div>
                  {brand&&<span style={{color:C.amber,fontWeight:900,fontSize:13,letterSpacing:'0.05em'}}>{brand}</span>}
                </div>
                <p style={{color:'rgba(255,255,255,0.85)',fontSize:15,letterSpacing:'0.18em',fontFamily:"'Courier New',monospace",marginBottom:14}}>
                  {cardNum||'•••• •••• •••• ••••'}
                </p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
                  <div><p style={{color:'rgba(255,255,255,0.4)',fontSize:9,letterSpacing:'0.12em',marginBottom:2}}>CARDHOLDER</p><p style={{color:'rgba(255,255,255,0.85)',fontSize:13,letterSpacing:'0.06em'}}>{cardName||'YOUR NAME'}</p></div>
                  <div style={{textAlign:'right'}}><p style={{color:'rgba(255,255,255,0.4)',fontSize:9,letterSpacing:'0.12em',marginBottom:2}}>EXPIRES</p><p style={{color:'rgba(255,255,255,0.85)',fontSize:13,letterSpacing:'0.06em'}}>{cardExp||'MM/YY'}</p></div>
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div>
                  <label style={lbl}>CARD NUMBER</label>
                  <input className="card-input" placeholder="4242 4242 4242 4242" value={cardNum} onChange={e=>setCardNum(fmtCard(e.target.value))} maxLength={19}/>
                  <p style={{color:C.dim,fontSize:11,marginTop:4}}>Demo: use 4242 4242 4242 4242</p>
                </div>
                <div>
                  <label style={lbl}>CARDHOLDER NAME</label>
                  <input className="card-input" placeholder="KASUN PERERA" value={cardName} onChange={e=>setCardName(e.target.value.toUpperCase())} style={{...inp,fontFamily:"'Courier New',monospace",letterSpacing:'0.05em'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <label style={lbl}>EXPIRY (MM/YY)</label>
                    <input className="card-input" placeholder="12/26" value={cardExp} onChange={e=>setCardExp(fmtExp(e.target.value))} maxLength={5}/>
                  </div>
                  <div>
                    <label style={lbl}>CVV</label>
                    <div style={{position:'relative'}}>
                      <input className="card-input" type={cvvShow?'text':'password'} placeholder="•••" value={cardCvv} onChange={e=>setCardCvv(e.target.value.replace(/\D/g,'').slice(0,4))} maxLength={4}/>
                      <button onClick={()=>setCvvShow(v=>!v)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.dim,cursor:'pointer',fontSize:11}}>{cvvShow?'HIDE':'SHOW'}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{marginTop:14,background:'#111110',border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px'}}>
                <p style={{color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.15em',marginBottom:10}}>ORDER TOTAL</p>
                <CostLine label="Venue Rental" amount={venueRent} C={C}/>
                {pickedItems.map(m=><CostLine key={m._id} label={`${m.name} ×${guests}`} amount={m.pricePerPlate*guests} sub C={C}/>)}
                {djPackage&&<CostLine label={`${djPackage.name} DJ`} amount={djTotal} sub C={C}/>}
                <div style={{borderTop:`1px solid ${C.border}`,marginTop:8,paddingTop:8}}>
                  <CostLine label="TOTAL CHARGE" amount={grandTotal} bold C={C}/>
                </div>
              </div>

              {payError&&(
                <div style={{display:'flex',alignItems:'flex-start',gap:8,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'11px 13px'}}>
                  <AlertCircle style={{width:14,height:14,color:'#f87171',flexShrink:0,marginTop:1}}/>
                  <p style={{color:'#f87171',fontSize:12,lineHeight:1.5}}>{payError}</p>
                </div>
              )}

              <button className="btn-amber" style={{marginTop:14,fontSize:14}} disabled={paying} onClick={handlePay}>
                {paying
                  ? <><Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}}/> PROCESSING PAYMENT…</>
                  : <><Shield style={{width:15,height:15}}/> PAY ${grandTotal.toLocaleString()} (DEMO)</>
                }
              </button>
              <p style={{color:C.dim,fontSize:11,textAlign:'center',marginTop:6}}>🔒 This is a demo. No real charge will be made.</p>
            </div>
          </div>
          )}

        </div>
      </div>
      )}
    </div>
  </div>

  {lightbox!==null&&<Lightbox images={hotel.images} start={lightbox} onClose={()=>setLightbox(null)}/>}
  </div>
  );
}

/* ── Cost Line ── */
function CostLine({label,amount,sub,bold,C}:{label:string;amount:number;sub?:boolean;bold?:boolean;C:Record<string,string>}){
  return(
    <div style={{display:'flex',justifyContent:'space-between',gap:8,marginBottom:sub?5:7}}>
      <span style={{color:sub?'#78716c':bold?'#fafaf9':'#a8a29e',fontSize:sub?11:13,fontWeight:bold?700:400,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{label}</span>
      <span style={{color:bold?C.amber:sub?'#a8a29e':'#d6d3d1',fontSize:sub?11:bold?16:13,fontWeight:bold?900:600,flexShrink:0}}>${amount.toLocaleString()}</span>
    </div>
  );
}

/* ── Booking Success ── */
function BookingSuccess({ref_,hotel,guests,eventType,eventDate,eventName,items,dj,venueRent,menuTotal,djTotal,grand,C}:{
  ref_:string;hotel:Hotel;guests:number;eventType:string;eventDate:string;eventName:string;
  items:MenuItem[];dj:DJPackage|null;venueRent:number;menuTotal:number;djTotal:number;grand:number;C:Record<string,string>;
}){
  const evLabel=EVENT_TYPES.find(e=>e.id===eventType)?.label||'Event';
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,overflow:'hidden'}} className="fade">
      {/* success banner */}
      <div style={{background:'linear-gradient(135deg,#052e1a,#071a0e)',borderBottom:`1px solid rgba(16,185,129,0.25)`,padding:'28px 24px',textAlign:'center'}}>
        <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(16,185,129,0.12)',border:`2px solid ${C.green}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
          <CheckCircle2 style={{width:32,height:32,color:C.green}}/>
        </div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'#fafaf9',marginBottom:6}}>Booking Confirmed!</h2>
        <p style={{color:'rgba(16,185,129,0.8)',fontSize:13,marginBottom:4}}>Reference: <strong style={{color:C.green,letterSpacing:'0.1em'}}>{ref_}</strong></p>
        <p style={{color:C.dim,fontSize:12}}>A confirmation has been sent to your email.</p>
      </div>

      <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:14}}>
        {/* event card */}
        <div style={{background:'#111110',border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
          <img src={hotel.images[0]} alt="" style={{width:'100%',height:100,objectFit:'cover',display:'block'}}/>
          <div style={{padding:'14px 16px'}}>
            <p style={{color:C.amber,fontSize:11,fontWeight:700,letterSpacing:'0.15em',marginBottom:4}}>{evLabel.toUpperCase()}</p>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:'#fafaf9',fontWeight:600,marginBottom:4}}>{eventName||hotel.name+' Event'}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:12,color:C.muted,fontSize:12}}>
              <span>📅 {new Date(eventDate).toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'})}</span>
              <span>👥 {guests} guests</span>
              <span>📍 {hotel.location}</span>
            </div>
          </div>
        </div>

        {/* receipt */}
        <div style={{background:'#111110',border:`1px solid ${C.border}`,borderRadius:12,padding:'14px 16px'}}>
          <p style={{color:C.dim,fontSize:10,fontWeight:700,letterSpacing:'0.15em',marginBottom:10}}>RECEIPT</p>
          <CostLine label="Venue Rental" amount={venueRent} C={C}/>
          {items.map(m=><CostLine key={m._id} label={`${m.name} ×${guests}`} amount={m.pricePerPlate*guests} sub C={C}/>)}
          {dj&&<CostLine label={`${dj.name} DJ Package`} amount={djTotal} sub C={C}/>}
          <div style={{borderTop:`1px solid ${C.border}`,marginTop:10,paddingTop:10}}>
            <CostLine label="TOTAL PAID" amount={grand} bold C={C}/>
          </div>
          <div style={{marginTop:10,display:'flex',alignItems:'center',gap:6,color:C.green,fontSize:12}}>
            <CheckCircle2 style={{width:13,height:13}}/> Payment processed (demo)
          </div>
        </div>

        <Link href="/" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px',color:C.muted,fontSize:13,fontWeight:700,textDecoration:'none',transition:'all 0.2s'}}>
          ← Browse More Venues
        </Link>
      </div>
    </div>
  );
}

/* ── Gallery ── */
function Gallery({images,name,onLightbox}:{images:string[];name:string;onLightbox:(i:number)=>void}){
  const [idx,setIdx]=useState(0);
  const prev=()=>setIdx(i=>i===0?images.length-1:i-1);
  const next=()=>setIdx(i=>i===images.length-1?0:i+1);
  return(
    <div style={{padding:20,display:'flex',flexDirection:'column',gap:10}}>
      <div style={{position:'relative',borderRadius:14,overflow:'hidden',height:400,cursor:'zoom-in'}} onClick={()=>onLightbox(idx)}>
        {images.map((img,i)=>(
          <img key={i} src={img} alt={`${name} ${i+1}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'opacity 0.5s ease',opacity:i===idx?1:0,zIndex:i===idx?1:0}}/>
        ))}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(12,10,9,0.3),transparent 50%)',zIndex:2,pointerEvents:'none'}}/>
        <button onClick={e=>{e.stopPropagation();prev();}} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',zIndex:3,width:40,height:40,borderRadius:'50%',background:'rgba(12,10,9,0.75)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <ChevronLeft style={{width:20,height:20}}/>
        </button>
        <button onClick={e=>{e.stopPropagation();next();}} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',zIndex:3,width:40,height:40,borderRadius:'50%',background:'rgba(12,10,9,0.75)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <ChevronRight style={{width:20,height:20}}/>
        </button>
        <div style={{position:'absolute',bottom:12,right:12,zIndex:3,background:'rgba(12,10,9,0.7)',borderRadius:50,padding:'4px 12px',color:'#d6d3d1',fontSize:12}}>{idx+1} / {images.length}</div>
        <button onClick={e=>{e.stopPropagation();onLightbox(idx);}} style={{position:'absolute',top:12,right:12,zIndex:3,width:36,height:36,borderRadius:'50%',background:'rgba(12,10,9,0.7)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Expand style={{width:15,height:15}}/>
        </button>
      </div>
      <div style={{display:'flex',gap:8}}>
        {images.map((img,i)=>(
          <button key={i} onClick={()=>setIdx(i)} style={{flex:1,height:70,borderRadius:9,overflow:'hidden',border:`2px solid ${i===idx?'#d97706':'transparent'}`,padding:0,cursor:'pointer',opacity:i===idx?1:0.5,transition:'all 0.2s',boxShadow:i===idx?'0 0 12px rgba(217,119,6,0.4)':'none'}}>
            <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── 360 Tour ── */
function Tour360({url}:{url:string}){
  const [drag,setDrag]=useState(false);
  const [ang,setAng]=useState(50);
  const [sx,setSx]=useState(0);
  const [sa,setSa]=useState(50);
  const [touched,setTouched]=useState(false);
  const raf=useRef<number|null>(null);
  useEffect(()=>{
    if(touched)return;
    let a=50,d=1;
    const go=()=>{a+=d*0.04;if(a>=65)d=-1;if(a<=35)d=1;setAng(a);raf.current=requestAnimationFrame(go);};
    raf.current=requestAnimationFrame(go);
    return()=>{if(raf.current)cancelAnimationFrame(raf.current);};
  },[touched]);
  const down=useCallback((x:number)=>{setTouched(true);if(raf.current)cancelAnimationFrame(raf.current);setDrag(true);setSx(x);setSa(ang);},[ang]);
  const mov=useCallback((x:number)=>{if(!drag)return;setAng(Math.max(0,Math.min(100,sa-(x-sx)/3)));},[drag,sx,sa]);
  const up=useCallback(()=>setDrag(false),[]);
  useEffect(()=>{window.addEventListener('mouseup',up);return()=>window.removeEventListener('mouseup',up);},[up]);
  return(
    <div style={{padding:20}}>
      <div style={{position:'relative',borderRadius:14,overflow:'hidden',height:400,cursor:drag?'grabbing':'grab',userSelect:'none'}}>
        <div style={{width:'100%',height:'100%',backgroundImage:`url(${url})`,backgroundSize:'200% auto',backgroundPosition:`${ang.toFixed(1)}% center`,transition:drag?'none':'background-position 0.05s linear'}}
          onMouseDown={e=>down(e.clientX)} onMouseMove={e=>mov(e.clientX)} onMouseUp={up}
          onTouchStart={e=>down(e.touches[0].clientX)} onTouchMove={e=>{e.preventDefault();mov(e.touches[0].clientX);}} onTouchEnd={up}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(12,10,9,0.5),transparent 40%)',pointerEvents:'none'}}/>
        {!touched&&<div style={{position:'absolute',top:16,left:'50%',transform:'translateX(-50%)',background:'rgba(12,10,9,0.82)',backdropFilter:'blur(8px)',border:'1px solid rgba(217,119,6,0.4)',borderRadius:50,padding:'8px 18px',display:'flex',alignItems:'center',gap:8,zIndex:2}}>
          <Move style={{width:13,height:13,color:'#d97706'}}/><span style={{color:'#fbbf24',fontSize:12,fontWeight:700,letterSpacing:'0.12em'}}>DRAG TO EXPLORE 360°</span>
        </div>}
        <div style={{position:'absolute',top:16,right:16,background:'#d97706',color:'#0c0a09',borderRadius:50,padding:'4px 10px',fontSize:11,fontWeight:900,zIndex:2}}>360°</div>
        {touched&&<button onClick={()=>{setTouched(false);setAng(50);}} style={{position:'absolute',top:16,left:16,background:'rgba(12,10,9,0.7)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',color:'#a8a29e',cursor:'pointer',zIndex:2}}><RotateCcw style={{width:13,height:13}}/></button>}
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'0 20px 16px',zIndex:2}}>
          <div style={{height:2,background:'rgba(255,255,255,0.1)',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${ang}%`,background:'#d97706',borderRadius:2,transition:'width 0.04s'}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:11}}>← West</span>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:11}}>East →</span>
          </div>
        </div>
      </div>
      <p style={{color:'#57534e',fontSize:12,textAlign:'center',marginTop:10}}>Drag left or right to explore the venue in 360°</p>
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({images,start,onClose}:{images:string[];start:number;onClose:()=>void}){
  const [i,setI]=useState(start);
  const prev=()=>setI(x=>x===0?images.length-1:x-1);
  const next=()=>setI(x=>x===images.length-1?0:x+1);
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='ArrowLeft')prev();if(e.key==='ArrowRight')next();};
    window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);
  });
  return(
    <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.96)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <button onClick={onClose} style={{position:'absolute',top:18,right:18,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'50%',width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',cursor:'pointer'}}><X style={{width:19,height:19}}/></button>
      <img src={images[i]} alt="" style={{maxWidth:'88vw',maxHeight:'84vh',objectFit:'contain',borderRadius:10}} onClick={e=>e.stopPropagation()}/>
      <button onClick={e=>{e.stopPropagation();prev();}} style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'50%',width:46,height:46,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',cursor:'pointer'}}><ChevronLeft style={{width:22,height:22}}/></button>
      <button onClick={e=>{e.stopPropagation();next();}} style={{position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'50%',width:46,height:46,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',cursor:'pointer'}}><ChevronRight style={{width:22,height:22}}/></button>
      <div style={{position:'absolute',bottom:18,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8}}>
        {images.map((_,j)=>(<button key={j} onClick={e=>{e.stopPropagation();setI(j);}} style={{width:j===i?22:8,height:8,borderRadius:50,background:j===i?'#d97706':'rgba(255,255,255,0.3)',border:'none',cursor:'pointer',transition:'all 0.2s',padding:0}}/>))}
      </div>
    </div>
  );
}

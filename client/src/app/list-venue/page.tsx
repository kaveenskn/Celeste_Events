'use client';
import Link from 'next/link';
import { Star, CheckCircle2, Users, TrendingUp, Globe, Heart, ArrowRight, Hotel, Shield, Zap, Award } from 'lucide-react';

export default function ListVenuePage() {
  const C = { bg:'#0c0a09', card:'#1c1917', border:'#292524', amber:'#d97706', muted:'#a8a29e', dim:'#57534e', green:'#10b981' };

  const STEPS = [
    { n:'01', title:'Submit Application', desc:'Fill out our simple multi-step application form with your business details, venue description, and contact information.', icon:Shield },
    { n:'02', title:'Admin Review',        desc:'Our team reviews your application within 2–3 business days. We verify business registration and venue credentials.', icon:CheckCircle2 },
    { n:'03', title:'Get Approved',        desc:'Once approved, you receive login credentials and can immediately start building your hotel profile on our platform.', icon:Zap },
    { n:'04', title:'Add Your Hotels',     desc:'Upload photos, write descriptions, set pricing, add menu items and availability — all from your owner dashboard.', icon:Hotel },
    { n:'05', title:'Admin Approves Venue',desc:'Each hotel listing is reviewed by our admin before going live. This ensures quality and trust for all platform users.', icon:Star },
    { n:'06', title:'Start Receiving Bookings', desc:'Your approved venues appear to thousands of event planners. Manage bookings, menus, and availability from your dashboard.', icon:TrendingUp },
  ];

  const BENEFITS = [
    { icon:Globe,        title:'10,000+ Monthly Visitors', desc:'Reach couples, corporates, and event planners actively searching for venues in Sri Lanka.', color:'#38bdf8' },
    { icon:TrendingUp,   title:'Revenue Growth',           desc:'Venues on our platform report average revenue increases of 35% in their first year.',        color:C.green },
    { icon:Shield,       title:'Verified Badge',           desc:'Approved partners receive a "Verified Venue" badge — building instant trust with clients.',   color:C.amber },
    { icon:Zap,          title:'Free to List',             desc:'No upfront listing fees. We operate on a small success commission only when you get bookings.', color:'#a78bfa' },
    { icon:Users,        title:'Booking Management',       desc:'Full dashboard with bookings, calendar, menu management, and detailed analytics.',             color:'#f472b6' },
    { icon:Award,        title:'Dedicated Support',        desc:'Our event specialists support you throughout your partnership — from onboarding to growth.',   color:C.green },
  ];

  return (
    <div style={{ background:C.bg, minHeight:'100vh' }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
      .step-card{border:1px solid #292524;border-radius:18px;padding:28px;background:#111110;transition:all 0.25s}
      .step-card:hover{border-color:rgba(217,119,6,0.3);transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.5)}
      .ben-card{border:1px solid #292524;border-radius:16px;padding:24px;background:#111110;transition:all 0.25s}
      .ben-card:hover{border-color:rgba(217,119,6,0.25);background:rgba(217,119,6,0.03)}
    `}</style>

    {/* Hero */}
    <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(160deg,#1a0f05 0%,#0c0a09 55%,#0a0f0a 100%)', padding:'80px 24px 72px' }}>
      <div style={{ position:'absolute', top:-80, right:-80, width:400, height:400, borderRadius:'50%', background:'rgba(217,119,6,0.05)' }}/>
      <div style={{ position:'absolute', bottom:-60, left:-40, width:280, height:280, borderRadius:'50%', background:'rgba(16,185,129,0.04)' }}/>
      <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', position:'relative' }}>
        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, color:C.dim, fontSize:13, textDecoration:'none', marginBottom:32 }}>
          ← Back to Home
        </Link>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.3)', borderRadius:50, padding:'6px 16px', marginBottom:24 }}>
          <Star style={{ width:13, height:13, color:C.amber, fill:C.amber }}/>
          <span style={{ color:'#fbbf24', fontSize:12, fontWeight:700, letterSpacing:'0.18em' }}>BECOME A PARTNER</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(34px,5vw,64px)', color:'#fafaf9', fontWeight:600, lineHeight:1.1, marginBottom:20 }}>
          List Your Venue on<br/><span style={{ color:C.amber, fontStyle:'italic' }}>Céleste Events</span>
        </h1>
        <p style={{ color:C.muted, fontSize:17, lineHeight:1.8, maxWidth:580, margin:'0 auto 36px' }}>
          Join Sri Lanka's premier event venue platform. Reach thousands of couples, corporates, and event planners actively searching for the perfect venue every month.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.amber, color:'#0c0a09', borderRadius:12, padding:'14px 32px', fontWeight:900, fontSize:14, letterSpacing:'0.1em', textDecoration:'none' }}>
            START APPLICATION <ArrowRight style={{ width:16, height:16 }}/>
          </Link>
          <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'transparent', border:`1px solid ${C.border}`, color:C.muted, borderRadius:12, padding:'14px 32px', fontWeight:700, fontSize:14, textDecoration:'none' }}>
            OWNER LOGIN
          </Link>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, background:'#0e0c0b' }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
        {[['10K+','Monthly visitors'],['500+','Events booked'],['4.8★','Avg rating'],['35%','Avg revenue boost']].map(([n,l])=>(
          <div key={l}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:C.amber, fontWeight:700, lineHeight:1, marginBottom:6 }}>{n}</p>
            <p style={{ color:C.dim, fontSize:13 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>

    {/* How it works */}
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'72px 24px 60px' }}>
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <p style={{ color:C.amber, fontSize:11, fontWeight:700, letterSpacing:'0.2em', marginBottom:14 }}>THE PROCESS</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, color:'#fafaf9', fontWeight:600 }}>How It Works</h2>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
        {STEPS.map(({n,title,desc,icon:Icon})=>(
          <div key={n} className="step-card">
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'rgba(217,119,6,0.3)', fontWeight:700, lineHeight:1 }}>{n}</span>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon style={{ width:17, height:17, color:C.amber }}/>
              </div>
            </div>
            <p style={{ color:'#e7e5e4', fontWeight:700, fontSize:16, marginBottom:8 }}>{title}</p>
            <p style={{ color:C.dim, fontSize:13, lineHeight:1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Benefits */}
    <div style={{ background:'linear-gradient(to bottom,#0c0a09,#0e0c0b)', borderTop:`1px solid ${C.border}`, padding:'72px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p style={{ color:C.green, fontSize:11, fontWeight:700, letterSpacing:'0.2em', marginBottom:14 }}>PARTNER BENEFITS</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, color:'#fafaf9', fontWeight:600 }}>Why Join Us?</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {BENEFITS.map(({icon:Icon,title,desc,color})=>(
            <div key={title} className="ben-card">
              <div style={{ width:44, height:44, borderRadius:12, background:`${color}12`, border:`1px solid ${color}22`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                <Icon style={{ width:20, height:20, color }}/>
              </div>
              <p style={{ color:'#e7e5e4', fontWeight:700, fontSize:15, marginBottom:8 }}>{title}</p>
              <p style={{ color:C.dim, fontSize:13, lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div style={{ background:`linear-gradient(135deg,rgba(217,119,6,0.08),rgba(217,119,6,0.02))`, borderTop:`1px solid rgba(217,119,6,0.2)`, padding:'60px 24px' }}>
      <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:'#fafaf9', fontWeight:600, marginBottom:14 }}>Ready to grow your<br/><span style={{ color:C.amber, fontStyle:'italic' }}>event business?</span></h2>
        <p style={{ color:C.muted, fontSize:15, lineHeight:1.8, marginBottom:32 }}>Applications take less than 5 minutes. Our team reviews within 2–3 business days.</p>
        <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:10, background:C.amber, color:'#0c0a09', borderRadius:14, padding:'16px 40px', fontWeight:900, fontSize:15, letterSpacing:'0.1em', textDecoration:'none' }}>
          APPLY NOW — IT'S FREE <ArrowRight style={{ width:17, height:17 }}/>
        </Link>
        <p style={{ color:C.dim, fontSize:12, marginTop:14 }}>Already approved? <Link href="/login" style={{ color:C.amber, textDecoration:'none', fontWeight:700 }}>Sign in →</Link></p>
      </div>
    </div>
    </div>
  );
}

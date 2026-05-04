'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck, Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const C = { amber: '#d97706', dim: '#57534e', muted: '#a8a29e', border: '#292524' };

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:'rgba(12,10,9,0.96)', backdropFilter:'blur(14px)', borderBottom:'1px solid rgba(146,64,14,0.22)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:66 }}>

          {/* Logo */}
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{ width:36, height:36, background:C.amber, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CalendarCheck style={{ width:20, height:20, color:'#0c0a09' }}/>
            </div>
            <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, color:'#fafaf9' }}>
              Céleste <span style={{ color:C.amber }}>Events</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }} className="desk-nav">
            <Link href="/#venues" style={{ padding:'8px 14px', fontSize:13, fontWeight:600, color:C.dim, borderRadius:8 }}>
              Browse Venues
            </Link>
            <Link href="/list-venue" style={{ padding:'8px 14px', fontSize:13, fontWeight:600, color:pathname==='/list-venue'?'#fbbf24':C.dim, borderRadius:8 }}>
              List Your Venue
            </Link>
            <div style={{ width:1, height:18, background:C.border, margin:'0 4px' }}/>
            <Link href="/login" style={{ padding:'8px 14px', fontSize:13, fontWeight:600, color:C.dim, borderRadius:8 }}>
              Owner Login
            </Link>
            <Link href="/list-venue" style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.amber, color:'#0c0a09', borderRadius:9, padding:'9px 18px', fontSize:13, fontWeight:900, letterSpacing:'0.08em' }}>
              LIST FREE <ArrowRight style={{ width:14, height:14 }}/>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} style={{ background:'none', border:'none', color:C.dim, cursor:'pointer', padding:4 }} className="mob-tog">
            {open ? <X style={{ width:24, height:24 }}/> : <Menu style={{ width:24, height:24 }}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:'#0c0a09', borderTop:'1px solid #1c1917', padding:'14px 24px 18px', display:'flex', flexDirection:'column', gap:4 }}>
          {[
            { href:'/#venues',   label:'Browse Venues' },
            { href:'/list-venue',label:'List Your Venue' },
            { href:'/login',     label:'Owner Login' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display:'block', padding:'11px 14px', borderRadius:9, color:C.muted, fontSize:14, fontWeight:600 }}>
              {label}
            </Link>
          ))}
          <Link href="/list-venue" onClick={() => setOpen(false)} style={{ display:'block', padding:'11px 14px', borderRadius:9, background:C.amber, color:'#0c0a09', fontSize:14, fontWeight:900, textAlign:'center', marginTop:8 }}>
            LIST YOUR VENUE FREE →
          </Link>
        </div>
      )}

      <style>{`
        @media(min-width:768px){.desk-nav{display:flex!important}.mob-tog{display:none!important}}
        @media(max-width:767px){.desk-nav{display:none!important}.mob-tog{display:block!important}}
      `}</style>
    </nav>
  );
}

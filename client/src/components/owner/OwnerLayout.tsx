'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Hotel, LayoutDashboard, UtensilsCrossed, BookOpen, User, LogOut, ChevronRight } from 'lucide-react';

interface Owner { fullName: string; email: string; businessName: string; }
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const NAV = [
  { href: '/owner/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/owner/hotels/new',label: 'My Hotels',  icon: Hotel },
  { href: '/owner/menu-items',label: 'Menu Items', icon: UtensilsCrossed },
  { href: '/owner/bookings',  label: 'Bookings',   icon: BookOpen },
  { href: '/owner/profile',   label: 'Profile',    icon: User },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (!d) router.push('/login'); else setOwner(d); });
  }, [router]);

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  const C = { bg: '#0c0a09', side: '#111110', border: '#292524', amber: '#d97706', dim: '#57534e', muted: '#a8a29e' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <style>{`
        .anav{display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:11px;text-decoration:none;transition:all 0.2s;font-size:14px;font-weight:600;margin-bottom:4px}
        .anav:hover{background:rgba(217,119,6,0.08);color:#fbbf24}
        .anav.active{background:rgba(217,119,6,0.12);color:#fbbf24;border:1px solid rgba(217,119,6,0.25)}
      `}</style>

      <div style={{ width: 240, background: C.side, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${C.border}` }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: C.amber, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hotel style={{ width: 18, height: 18, color: '#0c0a09' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: '#fafaf9' }}>Céleste</span>
          </Link>
        </div>

        {owner && (
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontWeight: 900, color: C.amber, fontSize: 15 }}>
              {owner.fullName[0]}
            </div>
            <p style={{ color: '#e7e5e4', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{owner.fullName}</p>
            <p style={{ color: C.dim, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{owner.businessName}</p>
          </div>
        )}

        <nav style={{ flex: 1, padding: '14px 12px' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/owner/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={`anav ${active ? 'active' : ''}`} style={{ color: active ? '#fbbf24' : C.muted }}>
                <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />{label}
                {active && <ChevronRight style={{ width: 14, height: 14, marginLeft: 'auto' }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px 12px 20px', borderTop: `1px solid ${C.border}` }}>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
            <LogOut style={{ width: 15, height: 15 }} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ flex: 1, marginLeft: 0, minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

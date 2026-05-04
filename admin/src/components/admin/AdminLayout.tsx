'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, LayoutDashboard, Hotel, Users, BookOpen,
  FileText, LogOut, ChevronRight, Bell, BarChart3
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/venues',       label: 'Venues',       icon: Hotel,     badge: 'pendingHotels' },
  { href: '/applications', label: 'Applications', icon: FileText,  badge: 'pendingOwners' },
  { href: '/owners',       label: 'All Owners',   icon: Users },
  { href: '/bookings',     label: 'Bookings',     icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [badges, setBadges] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) { router.push('/login'); return; }
        setBadges({ pendingHotels: d.pendingHotels, pendingOwners: d.pendingOwners });
      });
  }, [router]);

  const logout = async () => {
    await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const C = { bg: '#070605', side: '#0e0c0b', border: '#1e1c1a', amber: '#d97706', dim: '#57534e', muted: '#a8a29e' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter','Lato',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600;700&display=swap');
        .anav{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:10px;text-decoration:none;transition:all 0.2s;font-size:13px;font-weight:600;margin-bottom:3px;color:#78716c;border:1px solid transparent}
        .anav:hover{color:#fbbf24;background:rgba(217,119,6,0.07)}
        .anav.active{color:#fbbf24;background:rgba(217,119,6,0.1);border-color:rgba(217,119,6,0.2)}
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 232, background: C.side, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#d97706,#92400e)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield style={{ width: 17, height: 17, color: '#fff' }} />
            </div>
            <div>
              <p style={{ color: '#fafaf9', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>Céleste Admin</p>
              <p style={{ color: C.dim, fontSize: 11, marginTop: 2 }}>Management Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          <p style={{ color: '#3c3836', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', padding: '0 4px', marginBottom: 8 }}>NAVIGATION</p>
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            const count = badge ? badges[badge] || 0 : 0;
            return (
              <Link key={href} href={href} className={`anav ${active ? 'active' : ''}`}>
                <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {count > 0 && (
                  <span style={{ background: C.amber, color: '#0c0a09', borderRadius: 50, padding: '1px 7px', fontSize: 10, fontWeight: 900 }}>{count}</span>
                )}
                {active && <ChevronRight style={{ width: 13, height: 13, flexShrink: 0 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '10px 10px 18px', borderTop: `1px solid ${C.border}` }}>
          <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', borderRadius: 9, color: C.dim, textDecoration: 'none', fontSize: 13, marginBottom: 2 }}>
            <Hotel style={{ width: 14, height: 14 }} /> View Public Site
          </Link>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', borderRadius: 9, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            <LogOut style={{ width: 14, height: 14 }} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}

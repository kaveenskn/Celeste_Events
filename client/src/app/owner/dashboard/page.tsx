'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Hotel, BookOpen, TrendingUp, Users, Plus, ArrowRight, Calendar } from 'lucide-react';

interface Hotel { _id: string; name: string; location: string; basePrice: number; capacity: number; }
interface Booking { _id: string; guestName: string; totalPrice: number; eventDate: string; guestCount: number; hotelId: { name: string }; status: string; }

export default function OwnerDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/hotels').then(r => r.ok ? r.json() : []),
      fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/bookings').then(r => r.ok ? r.json() : []),
    ]).then(([h, b]) => { setHotels(h); setBookings(b); setLoading(false); });
  }, []);

  const revenue = bookings.reduce((s, b) => s + b.totalPrice, 0);
  const upcoming = bookings.filter(b => new Date(b.eventDate) >= new Date()).length;

  const C = { bg: '#0c0a09', card: '#1c1917', border: '#292524', amber: '#d97706', muted: '#a8a29e', dim: '#57534e', green: '#10b981' };

  return (
    <OwnerLayout>
      <div style={{ padding: '32px 32px 60px', background: C.bg, minHeight: '100vh' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');`}</style>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 4 }}>OVERVIEW</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, color: '#fafaf9', fontWeight: 600 }}>Venue Dashboard</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'My Hotels', value: hotels.length, icon: Hotel, color: C.amber },
            { label: 'Total Bookings', value: bookings.length, icon: BookOpen, color: '#38bdf8' },
            { label: 'Upcoming Events', value: upcoming, icon: Calendar, color: '#a78bfa' },
            { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, icon: TrendingUp, color: C.green },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color }} />
                </div>
                <span style={{ color: C.dim, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>{label.toUpperCase()}</span>
              </div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#fafaf9', fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Hotels */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#fafaf9' }}>My Hotels</h3>
              <Link href="/owner/hotels/new" style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.amber, color: '#0c0a09', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                <Plus style={{ width: 13, height: 13 }} /> Add Hotel
              </Link>
            </div>
            <div style={{ padding: '12px' }}>
              {hotels.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <Hotel style={{ width: 32, height: 32, color: C.dim, margin: '0 auto 12px' }} />
                  <p style={{ color: C.dim, fontSize: 14 }}>No hotels yet. Add your first venue.</p>
                  <Link href="/owner/hotels/new" style={{ color: C.amber, fontSize: 13, fontWeight: 700, textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>+ Add Hotel</Link>
                </div>
              ) : hotels.map(h => (
                <div key={h._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px', borderRadius: 10, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(217,119,6,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Hotel style={{ width: 18, height: 18, color: C.amber }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#e7e5e4', fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</p>
                    <p style={{ color: C.dim, fontSize: 12 }}>{h.location} · ${h.basePrice.toLocaleString()}</p>
                  </div>
                  <Link href={`/owner/hotels/${h._id}/edit`} style={{ color: C.amber, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Edit</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#fafaf9' }}>Recent Bookings</h3>
              <Link href="/owner/bookings" style={{ color: C.amber, fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <ArrowRight style={{ width: 13, height: 13 }} /></Link>
            </div>
            <div style={{ padding: '12px' }}>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <BookOpen style={{ width: 32, height: 32, color: C.dim, margin: '0 auto 12px' }} />
                  <p style={{ color: C.dim, fontSize: 14 }}>No bookings yet.</p>
                </div>
              ) : bookings.slice(0, 5).map(b => (
                <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#e7e5e4', fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.guestName}</p>
                    <p style={{ color: C.dim, fontSize: 11 }}>
                      {typeof b.hotelId === 'object' ? b.hotelId.name : ''} · {new Date(b.eventDate).toLocaleDateString()} · {b.guestCount} guests
                    </p>
                  </div>
                  <span style={{ color: C.green, fontWeight: 900, fontSize: 14, flexShrink: 0 }}>${b.totalPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}

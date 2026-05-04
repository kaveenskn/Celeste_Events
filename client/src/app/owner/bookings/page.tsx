'use client';
import { useState, useEffect } from 'react';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { BookOpen, Loader2, Calendar, Users, DollarSign, MapPin } from 'lucide-react';

interface Booking {
  _id: string; guestName: string; guestEmail: string; guestPhone: string;
  totalPrice: number; eventDate: string; guestCount: number;
  status: string; specialRequests?: string;
  hotelId: { name: string; location: string };
  selectedMenuItems: { name: string; pricePerPlate: number }[];
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/bookings').then(r => r.ok ? r.json() : []).then(d => { setBookings(d); setLoading(false); });
  }, []);

  const C = { bg: '#0c0a09', card: '#1c1917', border: '#292524', amber: '#d97706', muted: '#a8a29e', dim: '#57534e', green: '#10b981' };

  return (
    <OwnerLayout>
      <div style={{ padding: '32px', background: C.bg, minHeight: '100vh' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 4 }}>RESERVATIONS</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#fafaf9', marginBottom: 8 }}>All Bookings</h1>
        <p style={{ color: C.dim, fontSize: 13, marginBottom: 28 }}>{bookings.length} total bookings across your venues</p>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader2 style={{ width: 28, height: 28, color: C.amber, animation: 'spin 1s linear infinite' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 18 }}>
            <BookOpen style={{ width: 36, height: 36, color: C.dim, margin: '0 auto 14px' }} />
            <p style={{ color: C.muted, fontSize: 16 }}>No bookings yet.</p>
            <p style={{ color: C.dim, fontSize: 13, marginTop: 6 }}>Bookings will appear here once guests start reserving your venues.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
            {/* Table */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#111110', borderBottom: `1px solid ${C.border}` }}>
                      {['Guest', 'Hotel', 'Event Date', 'Guests', 'Total', 'Status', ''].map(h => (
                        <th key={h} style={{ padding: '12px 18px', textAlign: 'left', color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} style={{ borderBottom: `1px solid ${C.border}`, cursor: 'pointer', background: selected?._id === b._id ? 'rgba(217,119,6,0.06)' : 'transparent' }}
                        onClick={() => setSelected(selected?._id === b._id ? null : b)}>
                        <td style={{ padding: '14px 18px' }}>
                          <p style={{ color: '#e7e5e4', fontWeight: 700, fontSize: 14 }}>{b.guestName}</p>
                          <p style={{ color: C.dim, fontSize: 11 }}>{b.guestEmail}</p>
                        </td>
                        <td style={{ padding: '14px 18px', color: C.muted, fontSize: 13 }}>
                          {typeof b.hotelId === 'object' ? b.hotelId.name : '—'}
                        </td>
                        <td style={{ padding: '14px 18px', color: C.muted, fontSize: 13, whiteSpace: 'nowrap' }}>
                          {new Date(b.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 18px', color: C.muted, fontSize: 13 }}>{b.guestCount}</td>
                        <td style={{ padding: '14px 18px', color: C.amber, fontWeight: 900, fontSize: 15 }}>${b.totalPrice.toLocaleString()}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ background: `${C.green}18`, color: C.green, border: `1px solid ${C.green}44`, borderRadius: 50, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                            {b.status || 'confirmed'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', color: C.amber, fontSize: 12, fontWeight: 700 }}>Details →</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', height: 'fit-content' }}>
                <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.border}`, background: 'linear-gradient(135deg,#1a0f05,#1c1917)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em' }}>BOOKING DETAILS</p>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#fafaf9', marginBottom: 4 }}>{selected.guestName}</p>
                    <p style={{ color: C.dim, fontSize: 13 }}>{selected.guestEmail} · {selected.guestPhone}</p>
                  </div>
                  {[
                    { icon: MapPin, label: typeof selected.hotelId === 'object' ? selected.hotelId.name : '—' },
                    { icon: Calendar, label: new Date(selected.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                    { icon: Users, label: `${selected.guestCount} guests` },
                    { icon: DollarSign, label: `$${selected.totalPrice.toLocaleString()} total` },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.muted, fontSize: 13 }}>
                      <Icon style={{ width: 14, height: 14, color: C.amber, flexShrink: 0 }} />{label}
                    </div>
                  ))}
                  {selected.selectedMenuItems?.length > 0 && (
                    <div style={{ background: '#111110', borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>
                      <p style={{ color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 10 }}>MENU SELECTED</p>
                      {selected.selectedMenuItems.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                          <span style={{ color: C.muted }}>{m.name}</span>
                          <span style={{ color: '#e7e5e4' }}>${m.pricePerPlate}/plate</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {selected.specialRequests && (
                    <div style={{ background: '#111110', borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>
                      <p style={{ color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 6 }}>SPECIAL REQUESTS</p>
                      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{selected.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}

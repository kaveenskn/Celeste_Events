'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Plus, X, Loader2, ArrowLeft, Save } from 'lucide-react';

export default function NewHotelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', location: '', description: '', basePrice: '', capacity: '', image360: '' });
  const [images, setImages] = useState(['']);
  const [amenities, setAmenities] = useState(['']);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/hotels', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, basePrice: Number(form.basePrice), capacity: Number(form.capacity), images: images.filter(Boolean), amenities: amenities.filter(Boolean) }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push('/owner/dashboard');
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const C = { bg: '#0c0a09', card: '#1c1917', border: '#292524', amber: '#d97706', dim: '#57534e' };
  const inp: React.CSSProperties = { width: '100%', background: '#111110', border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', color: '#f5f5f4', fontSize: 14, fontFamily: 'inherit', outline: 'none' };
  const lbl: React.CSSProperties = { color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', display: 'block', marginBottom: 7 };

  return (
    <OwnerLayout>
      <div style={{ padding: '32px', background: C.bg, minHeight: '100vh' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');input:focus,textarea:focus{border-color:#d97706!important;outline:none}textarea{resize:vertical}`}</style>
        <div style={{ maxWidth: 720 }}>
          <Link href="/owner/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.dim, textDecoration: 'none', fontSize: 13, marginBottom: 24 }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Dashboard
          </Link>
          <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 4 }}>VENUE MANAGEMENT</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#fafaf9', marginBottom: 28 }}>Add New Hotel</h1>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#111110', border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px' }}>
              <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 18 }}>BASIC INFORMATION</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>HOTEL NAME *</label>
                  <input required style={inp} value={form.name} onChange={set('name')} placeholder="The Grand Meridian" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>LOCATION *</label>
                  <input required style={inp} value={form.location} onChange={set('location')} placeholder="Colombo, Sri Lanka" />
                </div>
                <div>
                  <label style={lbl}>BASE RENTAL PRICE (USD) *</label>
                  <input required type="number" min="0" style={inp} value={form.basePrice} onChange={set('basePrice')} placeholder="5000" />
                </div>
                <div>
                  <label style={lbl}>CAPACITY (GUESTS) *</label>
                  <input required type="number" min="1" style={inp} value={form.capacity} onChange={set('capacity')} placeholder="300" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>DESCRIPTION *</label>
                  <textarea required rows={4} style={inp} value={form.description} onChange={set('description')} placeholder="Describe your venue for events — atmosphere, facilities, what types of events you host..." />
                </div>
              </div>
            </div>

            <div style={{ background: '#111110', border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px' }}>
              <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 18 }}>PHOTOS</p>
              {images.map((img, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input style={{ ...inp, flex: 1 }} value={img} onChange={e => setImages(imgs => imgs.map((im, j) => j === i ? e.target.value : im))} placeholder="https://images.unsplash.com/..." />
                  {images.length > 1 && <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><X style={{ width: 16, height: 16 }} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => setImages(i => [...i, ''])} style={{ background: 'none', border: 'none', color: C.amber, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus style={{ width: 14, height: 14 }} /> Add Image URL
              </button>
              <div style={{ marginTop: 16 }}>
                <label style={lbl}>360° IMAGE URL (OPTIONAL)</label>
                <input style={inp} value={form.image360} onChange={set('image360')} placeholder="Wide panoramic image URL for 360° viewer" />
              </div>
            </div>

            <div style={{ background: '#111110', border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px' }}>
              <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 18 }}>AMENITIES</p>
              {amenities.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input style={{ ...inp, flex: 1 }} value={a} onChange={e => setAmenities(ams => ams.map((am, j) => j === i ? e.target.value : am))} placeholder="e.g. Ballroom, Pool, Valet Parking" />
                  {amenities.length > 1 && <button type="button" onClick={() => setAmenities(ams => ams.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><X style={{ width: 16, height: 16 }} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => setAmenities(a => [...a, ''])} style={{ background: 'none', border: 'none', color: C.amber, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus style={{ width: 14, height: 14 }} /> Add Amenity
              </button>
            </div>

            {error && <p style={{ color: '#f87171', fontSize: 13, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px' }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ background: loading ? C.border : C.amber, color: loading ? C.dim : '#0c0a09', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 900, fontSize: 13, letterSpacing: '0.12em', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> SAVING…</> : <><Save style={{ width: 16, height: 16 }} /> SAVE HOTEL</>}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </OwnerLayout>
  );
}

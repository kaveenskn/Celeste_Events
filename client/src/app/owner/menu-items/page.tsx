'use client';
import { useState, useEffect } from 'react';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Plus, X, Loader2, Save, Trash2, UtensilsCrossed } from 'lucide-react';

interface Hotel { _id: string; name: string; }
interface MenuItem { _id: string; name: string; description: string; pricePerPlate: number; category: string; image?: string; hotelId: string; }

const CATS = ['appetizer', 'main', 'dessert', 'beverage'] as const;

export default function MenuItemsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selHotel, setSelHotel] = useState('');
  const [form, setForm] = useState({ name: '', description: '', pricePerPlate: '', category: 'main', image: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/hotels').then(r => r.ok ? r.json() : []),
      fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/menu-items').then(r => r.ok ? r.json() : []),
    ]).then(([h, m]) => { setHotels(h); setItems(m); if (h.length) setSelHotel(h[0]._id); setLoading(false); });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selHotel) { setError('Please select a hotel first.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/menu-items', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pricePerPlate: Number(form.pricePerPlate), hotelId: selHotel }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const newItem = await res.json();
      setItems(i => [newItem, ...i]);
      setForm({ name: '', description: '', pricePerPlate: '', category: 'main', image: '' });
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/owner/menu-items/${id}`, { method: 'DELETE' });
    setItems(i => i.filter(x => x._id !== id));
  };

  const C = { bg: '#0c0a09', card: '#1c1917', border: '#292524', amber: '#d97706', muted: '#a8a29e', dim: '#57534e' };
  const inp: React.CSSProperties = { width: '100%', background: '#111110', border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px', color: '#f5f5f4', fontSize: 13, fontFamily: 'inherit', outline: 'none' };
  const lbl: React.CSSProperties = { color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', display: 'block', marginBottom: 7 };

  return (
    <OwnerLayout>
      <div style={{ padding: '32px', background: C.bg, minHeight: '100vh' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');input:focus,select:focus,textarea:focus{border-color:#d97706!important;outline:none}textarea{resize:vertical}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 4 }}>MENU MANAGEMENT</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#fafaf9', marginBottom: 28 }}>Menu Items</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
          {/* Add Form */}
          <div style={{ background: '#111110', border: `1px solid ${C.border}`, borderRadius: 18, padding: '22px' }}>
            <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus style={{ width: 13, height: 13 }} /> ADD MENU ITEM
            </p>
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>HOTEL *</label>
                <select value={selHotel} onChange={e => setSelHotel(e.target.value)} style={inp}>
                  {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>ITEM NAME *</label>
                <input required style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Saffron Chicken Biryani" />
              </div>
              <div>
                <label style={lbl}>CATEGORY *</label>
                <select style={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>PRICE PER PLATE (USD) *</label>
                <input required type="number" min="0" step="0.01" style={inp} value={form.pricePerPlate} onChange={e => setForm(f => ({ ...f, pricePerPlate: e.target.value }))} placeholder="35" />
              </div>
              <div>
                <label style={lbl}>DESCRIPTION *</label>
                <textarea required rows={3} style={inp} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe this dish..." />
              </div>
              <div>
                <label style={lbl}>IMAGE URL</label>
                <input style={inp} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://images.unsplash.com/..." />
              </div>
              {error && <p style={{ color: '#f87171', fontSize: 12 }}>{error}</p>}
              <button type="submit" disabled={saving} style={{ background: saving ? C.border : C.amber, color: saving ? C.dim : '#0c0a09', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 900, fontSize: 12, letterSpacing: '0.12em', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                {saving ? <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> SAVING…</> : <><Save style={{ width: 14, height: 14 }} /> ADD ITEM</>}
              </button>
            </form>
          </div>

          {/* Items list */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#fafaf9' }}>All Items ({items.length})</h3>
            </div>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                <Loader2 style={{ width: 24, height: 24, color: C.amber, animation: 'spin 1s linear infinite' }} />
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <UtensilsCrossed style={{ width: 32, height: 32, color: C.dim, margin: '0 auto 12px' }} />
                <p style={{ color: C.dim }}>No menu items yet.</p>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', maxHeight: 600 }}>
                {CATS.map(cat => {
                  const catItems = items.filter(i => i.category === cat);
                  if (!catItems.length) return null;
                  return (
                    <div key={cat}>
                      <div style={{ padding: '10px 22px', background: '#111110', borderBottom: `1px solid ${C.border}` }}>
                        <p style={{ color: C.amber, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em' }}>{cat.toUpperCase()}S</p>
                      </div>
                      {catItems.map(item => (
                        <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderBottom: `1px solid ${C.border}` }}>
                          {item.image && <img src={item.image} alt="" style={{ width: 48, height: 48, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: '#e7e5e4', fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                            <p style={{ color: C.dim, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                          </div>
                          <span style={{ color: C.amber, fontWeight: 900, fontSize: 15, flexShrink: 0 }}>${item.pricePerPlate}</span>
                          <button onClick={() => del(item._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }}>
                            <Trash2 style={{ width: 15, height: 15 }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}

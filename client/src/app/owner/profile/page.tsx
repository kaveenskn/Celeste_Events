'use client';
import { useState, useEffect } from 'react';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react';

interface Owner { fullName: string; email: string; phone: string; businessName: string; businessAddress: string; website: string; description: string; status: string; }

export default function OwnerProfilePage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ fullName: '', phone: '', website: '', description: '', newPassword: '' });
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/profile').then(r => r.ok ? r.json() : null).then(d => {
      if (d) { setOwner(d); setForm({ fullName: d.fullName, phone: d.phone, website: d.website || '', description: d.description, newPassword: '' }); }
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/owner/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setMsg('Profile updated successfully.');
      setForm(f => ({ ...f, newPassword: '' }));
    } catch { setMsg('Update failed. Please try again.'); }
    finally { setSaving(false); }
  };

  const C = { bg: '#0c0a09', card: '#1c1917', border: '#292524', amber: '#d97706', dim: '#57534e', green: '#10b981' };
  const inp: React.CSSProperties = { width: '100%', background: '#111110', border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', color: '#f5f5f4', fontSize: 14, fontFamily: 'inherit', outline: 'none' };
  const lbl: React.CSSProperties = { color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', display: 'block', marginBottom: 7 };

  if (loading) return <OwnerLayout><div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Loader2 style={{ width: 28, height: 28, color: C.amber, animation: 'spin 1s linear infinite' }} /></div></OwnerLayout>;

  return (
    <OwnerLayout>
      <div style={{ padding: '32px', background: C.bg, minHeight: '100vh' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');input:focus,textarea:focus{border-color:#d97706!important;outline:none}textarea{resize:vertical}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 4 }}>ACCOUNT</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#fafaf9', marginBottom: 28 }}>My Profile</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, maxWidth: 860 }}>
          {/* Info card */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px', textAlign: 'center', height: 'fit-content' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(217,119,6,0.15)', border: `2px solid rgba(217,119,6,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 28, fontWeight: 900, color: C.amber }}>
              {owner?.fullName[0].toUpperCase()}
            </div>
            <p style={{ color: '#e7e5e4', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{owner?.fullName}</p>
            <p style={{ color: C.dim, fontSize: 12, marginBottom: 12 }}>{owner?.email}</p>
            <span style={{ background: `${C.green}18`, color: C.green, border: `1px solid ${C.green}44`, borderRadius: 50, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>✓ Approved Partner</span>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}`, textAlign: 'left' }}>
              {[['Business', owner?.businessName], ['Address', owner?.businessAddress]].map(([k, v]) => (
                <div key={k as string} style={{ marginBottom: 10 }}>
                  <p style={{ color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 3 }}>{k as string}</p>
                  <p style={{ color: C.dim, fontSize: 12 }}>{v as string}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Edit form */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px' }}>
            <p style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 20 }}>EDIT PROFILE</p>
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={lbl}>FULL NAME *</label>
                  <input required style={inp} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                </div>
                <div>
                  <label style={lbl}>PHONE *</label>
                  <input style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={lbl}>WEBSITE</label>
                <input style={inp} value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://yourhotel.lk" />
              </div>
              <div>
                <label style={lbl}>VENUE DESCRIPTION</label>
                <textarea rows={4} style={inp} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label style={lbl}>NEW PASSWORD (leave blank to keep current)</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} style={{ ...inp, paddingRight: 50 }} value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.dim, cursor: 'pointer' }}>
                    {showPw ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                </div>
              </div>
              {msg && <p style={{ color: msg.includes('success') ? C.green : '#f87171', fontSize: 13 }}>{msg}</p>}
              <button type="submit" disabled={saving} style={{ background: saving ? C.border : C.amber, color: saving ? C.dim : '#0c0a09', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 900, fontSize: 13, letterSpacing: '0.12em', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {saving ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> SAVING…</> : <><Save style={{ width: 15, height: 15 }} /> SAVE CHANGES</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}

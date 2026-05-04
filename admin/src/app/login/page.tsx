'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const C = { bg: '#0c0a09', card: '#1c1917', border: '#292524', amber: '#d97706', dim: '#57534e' };
  const inp: React.CSSProperties = { width: '100%', background: '#111110', border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 16px 13px 44px', color: '#f5f5f4', fontSize: 14, fontFamily: 'inherit', outline: 'none' };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/dashboard');
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');@keyframes spin{to{transform:rotate(360deg)}}input:focus{border-color:#d97706!important;outline:none}`}</style>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'rgba(217,119,6,0.15)', border: `2px solid rgba(217,119,6,0.4)`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Shield style={{ width: 26, height: 26, color: C.amber }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#fafaf9' }}>Admin Portal</h2>
          <p style={{ color: C.dim, fontSize: 13, marginTop: 6 }}>Céleste Events Management System</p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '32px 28px' }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: C.dim }} />
              <input type="email" placeholder="admin@celeste.com" value={email} onChange={e => setEmail(e.target.value)} required style={inp} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: C.dim }} />
              <input type={show ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inp, paddingRight: 44 }} />
              <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.dim, cursor: 'pointer', padding: 0 }}>
                {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
            {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px' }}><AlertCircle style={{ width: 14, height: 14, color: '#f87171' }} /><p style={{ color: '#f87171', fontSize: 13 }}>{error}</p></div>}
            <button type="submit" disabled={loading} style={{ background: loading ? C.border : C.amber, color: loading ? C.dim : '#0c0a09', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 900, fontSize: 13, letterSpacing: '0.12em', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
              {loading ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> SIGNING IN…</> : 'ADMIN SIGN IN'}
            </button>
          </form>
          <p style={{ color: C.dim, fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            Default: admin@celeste.com / admin123
          </p>
        </div>
        <p style={{ color: C.dim, fontSize: 13, textAlign: 'center', marginTop: 20 }}>
          <Link href="/login" style={{ color: C.amber, textDecoration: 'none', fontWeight: 700 }}>← Venue Owner Login</Link>
        </p>
      </div>
    </div>
  );
}

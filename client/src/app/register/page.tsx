'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Building2, User, Mail, Phone, MapPin, FileText,
  Globe, ArrowRight, CheckCircle2, Loader2, AlertCircle,
  ChevronRight, Hotel, Star, Shield
} from 'lucide-react';

const STEPS = ['Business Info', 'Contact Details', 'About Venue', 'Review'] as const;

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    businessName: '', businessAddress: '', businessRegNumber: '',
    website: '', description: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = (): string => {
    if (step === 0 && (!form.businessName || !form.businessRegNumber || !form.businessAddress)) return 'Please fill all business fields.';
    if (step === 1 && (!form.fullName || !form.email || !form.phone)) return 'Please fill all contact fields.';
    if (step === 2 && form.description.length < 80) return 'Please write at least 80 characters describing your venue.';
    return '';
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001')+'/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally { setLoading(false); }
  };

  const C = { bg: '#0c0a09', card: '#1c1917', border: '#292524', amber: '#d97706', muted: '#a8a29e', dim: '#57534e', green: '#10b981' };
  const inp: React.CSSProperties = { width: '100%', background: '#111110', border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: '#f5f5f4', fontSize: 14, fontFamily: 'inherit', outline: 'none' };
  const lbl: React.CSSProperties = { color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', display: 'block', marginBottom: 7 };

  if (done) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 style={{ width: 36, height: 36, color: C.green }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#fafaf9', marginBottom: 12 }}>Application Submitted!</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
          Thank you, <strong style={{ color: '#e7e5e4' }}>{form.fullName}</strong>. Your application for <strong style={{ color: '#e7e5e4' }}>{form.businessName}</strong> has been received.<br /><br />
          Our admin team will review it within <strong style={{ color: C.amber }}>2–3 business days</strong>. Once approved, you'll receive login credentials at <strong style={{ color: '#e7e5e4' }}>{form.email}</strong>.
        </p>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.amber, color: '#0c0a09', borderRadius: 10, padding: '12px 24px', fontWeight: 900, fontSize: 13, letterSpacing: '0.1em', textDecoration: 'none' }}>
          BACK TO HOME
        </Link>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');`}</style>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap');
        input:focus,textarea:focus{border-color:#d97706 !important;box-shadow:0 0 0 3px rgba(217,119,6,0.12) !important;outline:none}
        textarea{resize:vertical}
        .step-item{display:flex;align-items:center;gap:10px;cursor:default}
        .next-btn{border:none;border-radius:12px;padding:14px 24px;font-weight:900;font-size:13px;letter-spacing:0.12em;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;transition:all 0.2s}
        .next-btn:hover:not(:disabled){filter:brightness(1.15);transform:translateY(-1px)}
        .next-btn:disabled{opacity:0.5;cursor:not-allowed}
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ background: 'linear-gradient(160deg,#1a0f05 0%,#0c0a09 60%,#0f1a0a 100%)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(217,119,6,0.05)' }} />
          <div style={{ position: 'absolute', bottom: 40, left: -80, width: 220, height: 220, borderRadius: '50%', background: 'rgba(16,185,129,0.04)' }} />

          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 60 }}>
              <div style={{ width: 36, height: 36, background: C.amber, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Hotel style={{ width: 20, height: 20, color: '#0c0a09' }} />
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#fafaf9' }}>Céleste <span style={{ color: C.amber }}>Events</span></span>
            </Link>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: '#fafaf9', lineHeight: 1.2, marginBottom: 16, fontWeight: 600 }}>
              List Your Venue<br /><span style={{ color: C.amber }}>Join Our Platform</span>
            </h1>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.8, marginBottom: 40 }}>
              Partner with Sri Lanka's premier event booking platform. Reach thousands of couples, corporates, and event planners looking for the perfect venue.
            </p>

            {[
              { icon: Star, label: 'Premium Exposure', desc: 'Reach 10,000+ monthly event planners' },
              { icon: Shield, label: 'Verified Listings', desc: 'Build trust with a verified badge' },
              { icon: CheckCircle2, label: 'Full Control', desc: 'Manage menus, pricing, availability & bookings' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Icon style={{ width: 18, height: 18, color: C.amber }} />
                </div>
                <div>
                  <p style={{ color: '#e7e5e4', fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{label}</p>
                  <p style={{ color: C.dim, fontSize: 13 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ color: C.dim, fontSize: 13 }}>Already approved? <Link href="/login" style={{ color: C.amber, textDecoration: 'none', fontWeight: 700 }}>Sign In →</Link></p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ background: '#111110', padding: '60px 48px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div className="step-item">
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, background: i < step ? C.green : i === step ? C.amber : C.border, color: i <= step ? '#0c0a09' : C.dim, transition: 'all 0.3s' }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: i === step ? C.amber : i < step ? C.green : C.dim, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? C.green : C.border, margin: '0 8px', transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div style={{ flex: 1 }}>

            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#fafaf9', marginBottom: 6 }}>Business Information</h2>
                <p style={{ color: C.dim, fontSize: 13, marginBottom: 28 }}>Tell us about your hotel or venue business.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={lbl}><Building2 style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} />BUSINESS / HOTEL NAME *</label>
                    <input style={inp} value={form.businessName} onChange={set('businessName')} placeholder="The Grand Meridian Hotel" />
                  </div>
                  <div>
                    <label style={lbl}><FileText style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} />BUSINESS REGISTRATION NUMBER *</label>
                    <input style={inp} value={form.businessRegNumber} onChange={set('businessRegNumber')} placeholder="PV 00123456" />
                  </div>
                  <div>
                    <label style={lbl}><MapPin style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} />BUSINESS ADDRESS *</label>
                    <input style={inp} value={form.businessAddress} onChange={set('businessAddress')} placeholder="123 Galle Road, Colombo 03, Sri Lanka" />
                  </div>
                  <div>
                    <label style={lbl}><Globe style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} />WEBSITE (OPTIONAL)</label>
                    <input style={inp} value={form.website} onChange={set('website')} placeholder="https://yourvenue.lk" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#fafaf9', marginBottom: 6 }}>Contact Details</h2>
                <p style={{ color: C.dim, fontSize: 13, marginBottom: 28 }}>This will be your account login information.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={lbl}><User style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} />FULL NAME *</label>
                    <input style={inp} value={form.fullName} onChange={set('fullName')} placeholder="Kasun Perera" />
                  </div>
                  <div>
                    <label style={lbl}><Mail style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} />EMAIL ADDRESS *</label>
                    <input type="email" style={inp} value={form.email} onChange={set('email')} placeholder="kasun@grandmeridian.lk" />
                    <p style={{ color: C.dim, fontSize: 11, marginTop: 5 }}>Your login credentials will be sent to this email after approval.</p>
                  </div>
                  <div>
                    <label style={lbl}><Phone style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} />PHONE NUMBER *</label>
                    <input type="tel" style={inp} value={form.phone} onChange={set('phone')} placeholder="+94 77 123 4567" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#fafaf9', marginBottom: 6 }}>About Your Venue</h2>
                <p style={{ color: C.dim, fontSize: 13, marginBottom: 28 }}>Describe what makes your venue special for events.</p>
                <div>
                  <label style={lbl}>VENUE DESCRIPTION * (min 80 characters)</label>
                  <textarea style={{ ...inp, minHeight: 160 }} value={form.description} onChange={set('description')} placeholder="Describe your venue — its atmosphere, capacity, event specialties, signature features, location highlights, and what makes it perfect for weddings, corporate events or celebrations..." />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <p style={{ color: C.dim, fontSize: 11 }}>The more detail, the stronger your application.</p>
                    <p style={{ color: form.description.length >= 80 ? C.green : C.amber, fontSize: 11, fontWeight: 700 }}>{form.description.length} / 80+</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#fafaf9', marginBottom: 6 }}>Review Your Application</h2>
                <p style={{ color: C.dim, fontSize: 13, marginBottom: 24 }}>Please confirm all details before submitting.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Business Name', value: form.businessName },
                    { label: 'Reg. Number', value: form.businessRegNumber },
                    { label: 'Address', value: form.businessAddress },
                    { label: 'Website', value: form.website || '—' },
                    { label: 'Contact Name', value: form.fullName },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: '#0c0a09', borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <span style={{ color: C.dim, fontSize: 12, fontWeight: 700, width: 130, flexShrink: 0 }}>{label}</span>
                      <span style={{ color: '#e7e5e4', fontSize: 13 }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ padding: '12px 14px', background: '#0c0a09', borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <p style={{ color: C.dim, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Venue Description</p>
                    <p style={{ color: '#e7e5e4', fontSize: 13, lineHeight: 1.7 }}>{form.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginTop: 20 }}>
              <AlertCircle style={{ width: 14, height: 14, color: '#f87171', flexShrink: 0 }} />
              <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
            {step > 0
              ? <button className="next-btn" onClick={() => { setError(''); setStep(s => s - 1); }} style={{ background: C.border, color: C.muted, padding: '14px 24px' }}>← Back</button>
              : <span />}
            {step < 3
              ? <button className="next-btn" onClick={next} style={{ background: C.amber, color: '#0c0a09' }}>Next Step <ChevronRight style={{ width: 16, height: 16 }} /></button>
              : <button className="next-btn" onClick={submit} disabled={loading} style={{ background: loading ? C.border : C.green, color: loading ? C.dim : '#0c0a09' }}>
                  {loading ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> SUBMITTING…</> : <><CheckCircle2 style={{ width: 16, height: 16 }} /> SUBMIT APPLICATION</>}
                </button>
            }
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

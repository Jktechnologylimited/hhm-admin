'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'sent'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setStatus('sent'); // Always show sent — don't reveal if email exists
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#06101C,#0B1A2E,#0f2240)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/logo.png" alt="HHM" width={56} height={56} style={{ objectFit: 'contain', marginBottom: 12 }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--orange)', marginBottom: 4 }}>Forgot Password</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>HHM Admin Portal</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,76,14,0.15)', borderRadius: 12, padding: 28 }}>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: 'rgba(46,204,113,0.12)', border: '2px solid rgba(46,204,113,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 20, color: '#2ecc71' }}>✓</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 10 }}>Check Your Email</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 20 }}>
                If that email is registered, a reset link has been sent. Check your inbox and spam folder. The link expires in 1 hour.
              </p>
              <Link href="/" style={{ fontSize: 12, color: 'rgba(232,76,14,0.7)', letterSpacing: 1 }}>Back to Login</Link>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 20 }}>
                Enter your admin email address and we'll send you a password reset link.
              </p>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="lbl">Admin Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="inp" placeholder="admin@heavenshospitality.org" />
                </div>
                <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ width: '100%', padding: '13px' }}>
                  {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) router.push('/');
  }, [token, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setErrorMsg('Passwords do not match'); return; }
    if (password.length < 8) { setErrorMsg('Password must be at least 8 characters'); return; }
    setStatus('loading'); setErrorMsg('');
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) setStatus('success');
    else { setStatus('error'); setErrorMsg(data.error || 'Invalid or expired link'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#06101C,#0B1A2E,#0f2240)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/logo.png" alt="HHM" width={56} height={56} style={{ objectFit: 'contain', marginBottom: 12 }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--orange)', marginBottom: 4 }}>Reset Password</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>HHM Admin Portal</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,76,14,0.15)', borderRadius: 12, padding: 28 }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: 'rgba(46,204,113,0.12)', border: '2px solid rgba(46,204,113,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 20, color: '#2ecc71' }}>✓</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 10 }}>Password Updated</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 20 }}>
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <button onClick={() => router.push('/')} className="btn-primary" style={{ width: '100%', padding: '13px' }}>Go to Login</button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="lbl">New Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="inp" placeholder="Minimum 8 characters" />
              </div>
              <div>
                <label className="lbl">Confirm Password</label>
                <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="inp" placeholder="Repeat new password" />
              </div>
              {errorMsg && <p style={{ fontSize: 12, color: '#ff8a80' }}>{errorMsg}</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ width: '100%', padding: '13px' }}>
                {status === 'loading' ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return <Suspense><ResetForm /></Suspense>;
}

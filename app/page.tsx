'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) router.push('/dashboard');
      else setError('Invalid credentials. Please try again.');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #06101C 0%, #0B1A2E 60%, #0f2240 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Image src="/logo.png" alt="HHM" width={64} height={64} style={{ objectFit: 'contain', marginBottom: 14 }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--orange)', marginBottom: 4 }}>Ministry Admin Portal</h1>
          <p style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Heaven's Hospitality Ministries</p>
        </div>

        {/* Form */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,76,14,0.15)', borderRadius: 12, padding: 32 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="lbl">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="inp" placeholder="admin@heavenshospitality.org" />
            </div>
            <div>
              <label className="lbl">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="inp" placeholder="••••••••" />
            </div>
            {error && <p style={{ fontSize: 12, color: '#ff8a80' }}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* JKTL credit */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <a href="https://www.jktl.com.ng" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4, transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}>
            <Image src="/images/jktl-logo.png" alt="JKTL" width={56} height={40} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: 9, letterSpacing: 1.5, color: 'rgba(100,160,255,0.7)', textTransform: 'uppercase' }}>JKTL V2 System</span>
          </a>
          <div style={{ marginTop: 10 }}>
            <a href="mailto:support@jktl.com.ng" style={{ fontSize: 10, color: 'rgba(100,150,255,0.35)' }}>support@jktl.com.ng</a>
          </div>
        </div>

      </div>
    </div>
  );
}

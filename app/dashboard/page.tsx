'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ devotions:0, sermons:0, subscribers:0, prayers:0, offerings:0, events:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/devotions?limit=1').then(r=>r.json()),
      fetch('/api/sermons?limit=1').then(r=>r.json()),
      fetch('/api/newsletter').then(r=>r.json()),
      fetch('/api/prayer').then(r=>r.json()),
      fetch('/api/offerings').then(r=>r.json()),
      fetch('/api/events').then(r=>r.json()),
    ]).then(([d,s,n,p,o,e]) => {
      setStats({
        devotions: d.total||0,
        sermons: s.total||0,
        subscribers: n.total||0,
        prayers: p.prayers?.length||0,
        offerings: o.stats?.successful_count||0,
        events: e.events?.length||0,
      });
    }).finally(() => setLoading(false));
  }, [router]);

  const statCards = [
    { label: 'Devotions', value: stats.devotions, href: '/admin/devotions' },
    { label: 'Sermons', value: stats.sermons, href: '/admin/sermons' },
    { label: 'Subscribers', value: stats.subscribers, href: '/admin/subscribers' },
    { label: 'Prayer Requests', value: stats.prayers, href: '/admin/prayers' },
    { label: 'Offerings Received', value: stats.offerings, href: '/admin/offerings' },
    { label: 'Events', value: stats.events, href: '/admin/events' },
  ];

  const quickActions = [
    { href: '/admin/devotions/new', label: 'New Devotion' },
    { href: '/admin/sermons/new', label: 'Add Sermon' },
    { href: '/admin/events', label: 'Manage Events' },
    { href: '/admin/training', label: 'Training Sessions' },
    { href: '/admin/miracles', label: 'Review Testimonies' },
    { href: '/admin/offerings', label: 'View Transactions' },
    { href: '/admin/missions', label: 'Update Missions' },
    { href: '/api/init', label: 'Init Database' },
  ];

  const cardBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(232,76,14,0.12)',
    borderRadius: 8,
    padding: 'clamp(16px,3vw,24px)',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'block',
    cursor: 'pointer',
  };

  return (
    <AdminLayout title="Dashboard">
      <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
        Welcome back. Here's an overview of the ministry.
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,160px),1fr))', gap: 14, marginBottom: 36 }}>
        {statCards.map(item => (
          <Link
            key={item.label}
            href={item.href}
            style={cardBase}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,76,14,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(232,76,14,0.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,76,14,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,4vw,36px)', color: 'var(--orange)', fontWeight: 700 }}>
              {loading ? '—' : item.value}
            </div>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginTop: 6 }}>
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, color: 'white', marginBottom: 16 }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,200px),1fr))', gap: 12 }}>
        {quickActions.map(item => (
          <Link
            key={item.label}
            href={item.href}
            target={item.href.startsWith('/api') ? '_blank' : undefined}
            rel={item.href.startsWith('/api') ? 'noopener' : undefined}
            style={{ ...cardBase, padding: '16px 18px' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,76,14,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(232,76,14,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,76,14,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, fontWeight: 600, color: 'white' }}>{item.label}</div>
            {item.href.startsWith('/api') && (
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Opens in new tab</div>
            )}
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

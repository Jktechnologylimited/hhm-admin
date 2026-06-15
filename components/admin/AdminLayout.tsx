'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, BookOpen, Mic2, Calendar, GraduationCap,
  Globe, Trophy, Sparkles, Users, HandHeart, DollarSign,
  Settings, LogOut, ExternalLink, ChevronLeft, ChevronRight,
  Library, FileText,
} from 'lucide-react';

const MAIN_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://heavenshospitality.org';

const NAV = [
  { href: '/dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/devotions',      label: 'Devotions',       icon: BookOpen        },
  { href: '/sermons',        label: 'Sermons',         icon: Mic2            },
  { href: '/events',         label: 'Events',          icon: Calendar        },
  { href: '/training',       label: 'Training',        icon: GraduationCap   },
  { href: '/missions',       label: 'Missions',        icon: Globe           },
  { href: '/accomplishments',label: 'Accomplishments', icon: Trophy          },
  { href: '/miracles',       label: 'Miracles',        icon: Sparkles        },
  { href: '/subscribers',    label: 'Subscribers',     icon: Users           },
  { href: '/prayers',        label: 'Prayer Requests', icon: HandHeart       },
  { href: '/offerings',      label: 'Offerings',       icon: DollarSign      },
  { href: '/books',          label: 'Books',           icon: Library         },
  { href: '/content',         label: 'Site Content',    icon: FileText        },
  { href: '/settings',        label: 'Settings',        icon: Settings        },
];

export default function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.push('/'); });
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setCollapsed(true);
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const w = collapsed ? 60 : 224;

  return (
    <div style={{ minHeight: '100vh', background: '#06101C', display: 'flex' }}>

      <aside style={{
        width: w, minWidth: w,
        background: '#0B1A2E',
        borderRight: '1px solid rgba(232,76,14,0.12)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        position: 'sticky', top: 0, height: '100vh',
        flexShrink: 0,
      }}>

        {/* Logo + collapse toggle */}
        <div style={{
          height: 64,
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0 10px' : '0 14px',
          borderBottom: '1px solid rgba(232,76,14,0.1)',
          flexShrink: 0,
          gap: 8,
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, overflow: 'hidden', flex: 1 }}>
              <Image src="/logo.png" alt="HHM" width={32} height={32} style={{ objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)', whiteSpace: 'nowrap', letterSpacing: 0.3 }}>HHM Admin</div>
                <div style={{ fontSize: 8, letterSpacing: 1.5, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Ministry Portal</div>
              </div>
            </div>
          )}
          {collapsed && (
            <Image src="/logo.png" alt="HHM" width={30} height={30} style={{ objectFit: 'contain' }} />
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'rgba(232,76,14,0.1)',
              border: '1px solid rgba(232,76,14,0.2)',
              borderRadius: 6,
              color: 'var(--orange)',
              cursor: 'pointer',
              width: 26, height: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}>
            {collapsed
              ? <ChevronRight size={14} />
              : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '10px 8px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? 0 : 10,
                  padding: '9px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 7,
                  color: active ? 'var(--orange)' : 'rgba(255,255,255,0.6)',
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 400,
                  marginBottom: 2,
                  background: active ? 'rgba(232,76,14,0.1)' : 'transparent',
                  borderLeft: active && !collapsed ? '2px solid var(--orange)' : '2px solid transparent',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(232,76,14,0.06)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon
                  size={16}
                  style={{ flexShrink: 0, color: active ? 'var(--orange)' : 'rgba(255,255,255,0.45)' }}
                />
                {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
              </Link>
            );
          })}

          {/* View website */}
          <a
            href={MAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? 'View Website' : undefined}
            style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 10,
              padding: '9px 10px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 7,
              color: 'rgba(255,255,255,0.3)',
              fontSize: 12.5,
              marginTop: 6,
              borderTop: '1px solid rgba(232,76,14,0.08)',
              paddingTop: 14,
              transition: 'color 0.15s',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            <ExternalLink size={16} style={{ flexShrink: 0, color: 'rgba(255,255,255,0.25)' }} />
            {!collapsed && 'View Website'}
          </a>
        </nav>

        {/* Sign out */}
        <div style={{ padding: '8px 8px 0', flexShrink: 0 }}>
          <button
            onClick={logout}
            title={collapsed ? 'Sign Out' : undefined}
            style={{
              width: '100%',
              padding: '9px 10px',
              background: 'rgba(255,60,60,0.07)',
              border: '1px solid rgba(255,60,60,0.12)',
              borderRadius: 7,
              color: 'rgba(255,110,110,0.8)',
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 10,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,60,60,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,60,60,0.07)')}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>

        {/* JKTL credit */}
        <div style={{
          borderTop: '1px solid rgba(232,76,14,0.08)',
          padding: collapsed ? '10px 8px' : '10px 12px',
          marginTop: 6, flexShrink: 0, overflow: 'hidden',
        }}>
          <a
            href="https://www.jktl.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            title="JKTL V2 System — Built by JK Technology Limited"
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 8,
              textDecoration: 'none', opacity: 0.45,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jktl-logo.png" alt="JKTL" style={{ height: 20, width: 'auto', objectFit: 'contain', flexShrink: 0, filter: 'brightness(1.3)' }} />
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(100,160,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>JKTL V2 System</div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap' }}>jktl.com.ng</div>
              </div>
            )}
          </a>
        </div>

      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: 'clamp(20px,3vw,36px)', overflow: 'auto', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: 'white', margin: 0 }}>{title}</h1>
          <a
            href="mailto:support@jktl.com.ng"
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(100,150,255,0.12)', borderRadius: 6, padding: '7px 14px', opacity: 0.6, transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jktl-logo.png" alt="JKTL" style={{ height: 16, width: 'auto', filter: 'brightness(1.3)' }} />
            <span style={{ fontSize: 9, color: 'rgba(100,160,255,0.7)', letterSpacing: 0.5 }}>JKTL Support</span>
          </a>
        </div>
        {children}
      </main>

    </div>
  );
}

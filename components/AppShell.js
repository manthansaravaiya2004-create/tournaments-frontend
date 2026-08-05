'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || loading) {
    return <div className="min-h-screen bg-ink-950" />;
  }

  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isPublicLanding = pathname === '/';
  const isContactRoute = pathname === '/contact';

  // Admin and Auth routes handle their own full-page layouts
  if (isAdminRoute || isAuthRoute) {
    return children;
  }

  // If logged in, provide the gamified Sidebar App Shell for all pages (except landing/contact)
  if (user && !isPublicLanding && !isContactRoute) {
    const links = [
      { name: 'Dashboard', path: '/dashboard', icon: '📊' },
      { name: 'Tournaments', path: '/tournaments', icon: '🎮' },
      { name: 'My Teams', path: '/dashboard/teams', icon: '🛡️' },
      { name: 'Results', path: '/results', icon: '🏆' },
      { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
      { name: 'Terms', path: '/terms', icon: '📜' },
    ];

    return (
      <div className="flex h-screen bg-ink-950 overflow-hidden font-body text-mist-100">
        {/* Mobile Toggle */}
        <button 
          className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-ink-900 border border-ink-700 rounded-md text-mist-200 focus-ring"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {drawerOpen ? '✕' : '☰'}
        </button>

        {drawerOpen && (
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r border-ink-700 bg-ink-900/95 backdrop-blur-xl flex flex-col pt-16 md:pt-6 pb-6
          transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="px-6 mb-8">
            <div className="flex h-16 shrink-0 items-center">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded object-cover" />
                <span className="font-display text-xl font-bold tracking-tight text-white">Bracketed</span>
              </Link>
            </div>
            <h2 className="font-display text-lg font-semibold text-mist-100 truncate">Welcome, {user.username}</h2>
            <p className="text-xs text-mist-400">Player Dashboard</p>
          </div>

          <nav className="flex-1 space-y-2 px-4 overflow-y-auto custom-scrollbar">
            {links.map((link) => {
              // Match exact path for dashboard, prefix for others
              const isActive = link.path === '/dashboard' 
                ? pathname === '/dashboard' 
                : pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-signal-violet/20 text-signal-violet border border-signal-violet/30 shadow-[0_0_15px_rgba(113,84,255,0.1)]' 
                      : 'text-mist-400 hover:bg-ink-800/50 hover:text-mist-100 border border-transparent'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto md:ml-64 w-full relative bg-ink-950">
          <header className="sticky top-0 z-30 flex items-center justify-end border-b border-ink-700 bg-ink-950/85 px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-mist-100 leading-tight">{user.username}</p>
                <p className="text-xs text-signal-teal font-medium capitalize">{user.role}</p>
              </div>
              <button 
                onClick={() => {
                  document.cookie = 'token=; Max-Age=0; path=/;';
                  window.location.href = '/';
                }} 
                className="rounded-md border border-ink-700 bg-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-mist-400 hover:text-white hover:border-signal-violet transition-all"
              >
                Sign out
              </button>
            </div>
          </header>
          <div className="pt-4 md:pt-0 pb-12">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Fallback to public layout with top Navbar and Footer
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

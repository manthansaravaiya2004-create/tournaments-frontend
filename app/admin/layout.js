'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (loading) return null;
  
  if (!user || user.role !== 'superadmin') {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-mist-100">Super Admin access required</h1>
        <p className="mt-2 text-sm text-mist-400">This page is restricted to super admin accounts.</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Tournaments', path: '/admin/tournaments', icon: '🏆' },
    { name: 'Create Tournament', path: '/admin/tournaments/new', icon: '➕' },
    { name: 'Payments', path: '/admin/payments', icon: '💳' },
    { name: 'Notifications', path: '/admin/notifications', icon: '🔔' },
    { name: 'File Manager', path: '/admin/files', icon: '📁' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-ink-950 relative">
      
      {/* Mobile Drawer Toggle */}
      <button 
        className="md:hidden absolute top-4 left-4 z-50 text-mist-200 hover:text-white p-2 rounded-md bg-ink-800 border border-ink-700"
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        {drawerOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-ink-700 bg-ink-900/95 backdrop-blur-xl flex flex-col pt-16 md:pt-6 pb-6
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-16 shrink-0 items-center px-6 mb-4">
          <Link href="/admin" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="rounded-sm object-cover group-hover:scale-110 transition-transform" />
            <span className="font-display text-xl font-bold tracking-tight text-white">Bracketed</span>
          </Link>
        </div>
        <div className="px-6 mb-8">
          <h2 className="font-display text-lg font-semibold text-mist-100">Admin Panel</h2>
          <p className="text-xs text-mist-400">Manage the platform</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 hide-scrollbar">
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-signal-violet/10 text-signal-violet shadow-[inset_3px_0_0_0] shadow-signal-violet' 
                    : 'text-mist-400 hover:bg-ink-800/50 hover:text-mist-200'
                }`}
              >
                <span className="text-lg opacity-80">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <main className="flex-1 overflow-y-auto md:ml-64 w-full relative">
        <header className="sticky top-0 z-30 flex items-center justify-end border-b border-ink-700 bg-ink-950/85 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-mist-200">{user.username}</span>
            <button 
              onClick={() => {
                // simple logout
                document.cookie = 'token=; Max-Age=0; path=/;';
                window.location.href = '/';
              }} 
              className="rounded-md border border-ink-700 bg-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-mist-400 hover:text-white hover:border-ink-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>
        <div className="pt-4 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

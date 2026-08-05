'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  
  const isAdminRoute = pathname?.startsWith('/admin');
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  if (isAdminRoute || isDashboardRoute) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image src="/logo.png" alt="Bracketed Logo" width={32} height={32} className="rounded-md object-cover" />
            <span className="font-display text-xl font-black tracking-tight text-white">Bracketed</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        {!isAdminRoute && (
          <nav className="hidden items-center justify-center gap-6 text-sm text-mist-400 md:flex flex-1">
            <Link href="/tournaments" className="hover:text-mist-100 transition-colors">Tournaments</Link>
            <Link href="/results" className="hover:text-mist-100 transition-colors">Results</Link>
            {user && <Link href="/dashboard" className="hover:text-mist-100 transition-colors">Dashboard</Link>}
            {user?.role === 'superadmin' && <Link href="/admin" className="hover:text-mist-100 transition-colors text-signal-violet">Super Admin</Link>}
            {user?.role === 'superadmin' && (
              <Link href="/tournaments/new" className="hover:text-mist-100 transition-colors">Create tournament</Link>
            )}
          </nav>
        )}

        {/* Right: User Actions */}
        <div className="flex items-center justify-end gap-3 flex-1">
          {loading ? null : user ? (
            <>
              <span className="hidden text-sm text-mist-400 sm:inline">{user.username}</span>
              <button
                onClick={logout}
                className="focus-ring rounded-md border border-ink-600 px-3 py-1.5 text-sm text-mist-200 transition-colors hover:border-signal-violet hover:text-mist-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="focus-ring rounded-md px-3 py-1.5 text-sm text-mist-200 hover:text-mist-100">
                Sign in
              </Link>
              <Link
                href="/register"
                className="focus-ring rounded-md bg-signal-violet px-3 py-1.5 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

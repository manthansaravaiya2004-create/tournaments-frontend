'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-mist-100">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-signal-violet" />
          Bracketed
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-mist-400 md:flex">
          <Link href="/tournaments" className="hover:text-mist-100 transition-colors">Tournaments</Link>
          {user && <Link href="/dashboard" className="hover:text-mist-100 transition-colors">Dashboard</Link>}
          {user?.role === 'superadmin' && <Link href="/admin" className="hover:text-mist-100 transition-colors text-signal-violet">Super Admin</Link>}
          {user?.role === 'superadmin' && (
            <Link href="/tournaments/new" className="hover:text-mist-100 transition-colors">Create tournament</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
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

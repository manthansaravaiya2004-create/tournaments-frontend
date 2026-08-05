'use client';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-mist-100">Sign in required</h1>
        <p className="mt-2 text-sm text-mist-400">
          <Link href="/login" className="text-signal-violet hover:underline">Sign in</Link> to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-mist-100">Welcome back, {user.username}</h1>
      <p className="mt-1 text-sm text-mist-400">Role: <span className="capitalize text-mist-200">{user.role}</span></p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatCard label="Tournaments played" value={user.stats?.tournamentsPlayed ?? 0} />
        <StatCard label="Wins" value={user.stats?.wins ?? 0} />
        <StatCard label="Win rate" value={user.stats?.tournamentsPlayed ? `${Math.round((user.stats.wins / user.stats.tournamentsPlayed) * 100)}%` : '—'} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/tournaments" className="focus-ring rounded-md border border-ink-600 px-4 py-2 text-sm text-mist-200 hover:border-signal-violet hover:text-mist-100">
          Browse tournaments
        </Link>
        {user.role === 'superadmin' && (
          <Link href="/tournaments/new" className="focus-ring rounded-md bg-signal-violet px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90">
            Create tournament
          </Link>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/50 p-5">
      <p className="font-mono text-2xl font-semibold text-mist-100">{value}</p>
      <p className="mt-1 text-xs text-mist-400">{label}</p>
    </div>
  );
}

'use client';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">Welcome back, {user.username}</h1>
        <p className="text-sm text-mist-400">Role: <span className="capitalize text-signal-teal font-medium tracking-wide">{user.role}</span></p>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        <StatCard label="Tournaments played" value={user.stats?.tournamentsPlayed ?? 0} icon="🎮" />
        <StatCard label="Matches won" value={user.stats?.wins ?? 0} icon="🏆" />
        <StatCard label="Win rate" value={user.stats?.tournamentsPlayed ? `${Math.round((user.stats.wins / user.stats.tournamentsPlayed) * 100)}%` : '—'} icon="📈" />
      </div>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link href="/tournaments" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-signal-violet px-5 py-2.5 text-sm font-bold text-ink-950 transition-all hover:bg-signal-violet/90 shadow-[0_0_15px_rgba(113,84,255,0.2)]">
          <span>🎮</span> Browse Tournaments
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="font-mono text-4xl font-black tracking-tight text-mist-100 mb-2">{value}</p>
      <p className="text-sm font-bold uppercase tracking-widest text-mist-400">{label}</p>
    </div>
  );
}

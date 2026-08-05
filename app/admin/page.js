'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Link from 'next/link';

export default function AdminPage() {
  const { user, token, loading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin' && token) {
      api.adminOverview(token).then(setOverview).catch((err) => setError(err.message));
    }
  }, [user, token]);

  if (loading) return null;

  if (!user || user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-mist-100">Admin access required</h1>
        <p className="mt-2 text-sm text-mist-400">This page is restricted to admin accounts.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-mist-100">Admin overview</h1>

      {error && <p className="mt-4 text-sm text-signal-red">{error}</p>}

      {overview && (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-4">
            <Stat label="Tournaments" value={overview.tournamentCount} />
            <Stat label="Teams registered" value={overview.teamCount} />
            <Stat label="Users" value={overview.userCount} />
            <Stat label="Revenue" value={`$${overview.totalRevenue}`} accent />
          </div>

          <h2 className="mt-10 mb-4 font-display text-lg font-semibold text-mist-100">Upcoming & active</h2>
          <div className="divide-y divide-ink-700 rounded-lg border border-ink-700 bg-ink-900/50">
            {overview.upcoming.length === 0 && <p className="p-5 text-sm text-mist-400">Nothing scheduled.</p>}
            {overview.upcoming.map((t) => (
              <Link key={t._id} href={`/tournaments/${t._id}`} className="focus-ring flex items-center justify-between px-5 py-4 hover:bg-ink-800/50">
                <div>
                  <p className="text-sm font-medium text-mist-100">{t.name}</p>
                  <p className="font-mono text-xs text-mist-400">{t.game}</p>
                </div>
                <div className="text-right text-sm text-mist-400">
                  <p>{t.teams?.length || 0}/{t.maxTeams} teams</p>
                  <p className="capitalize">{t.status.replace('_', ' ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/50 p-5">
      <p className={`font-mono text-2xl font-semibold ${accent ? 'text-signal-teal' : 'text-mist-100'}`}>{value}</p>
      <p className="mt-1 text-xs text-mist-400">{label}</p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { user, token, loading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'superadmin' && token) {
      api.adminOverview(token)
        .then(data => setOverview(data))
        .catch(err => setError(err.message));
    }
  }, [user, token]);

  if (loading) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">Platform Overview</h1>
      <p className="text-sm text-mist-400 mb-8">High-level statistics and revenue tracking.</p>

      {error && <p className="mb-6 rounded-md bg-signal-red/10 p-4 text-sm text-signal-red border border-signal-red/20">{error}</p>}

      {overview ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Live Visitors" value={overview.liveUsers} icon="🟢" accent />
          <Stat label="Total Tournaments" value={overview.tournamentCount} icon="🏆" />
          <Stat label="Total Teams" value={overview.teamCount} icon="🎮" />
          <Stat label="Total Users" value={overview.userCount} icon="👥" />
          <Stat label="Gross Revenue" value={`₹${overview.totalRevenue}`} icon="💰" />
        </div>
      ) : (
        !error && <p className="text-mist-400">Loading statistics...</p>
      )}

      <div className="mt-12 rounded-xl border border-ink-700 bg-ink-900/40 p-8 text-center">
        <h2 className="font-display text-xl font-medium text-mist-200 mb-4">Welcome to the Command Center</h2>
        <p className="text-mist-400 max-w-lg mx-auto">
          Use the sidebar on the left to navigate through tournament management, user roles, payments, and global settings.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, icon }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-6 hover:border-ink-500 hover:bg-ink-800/80 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {accent && <span className="flex h-2 w-2 rounded-full bg-signal-teal animate-pulse" />}
      </div>
      <p className={`font-mono text-3xl font-bold tracking-tight ${accent ? 'text-signal-teal' : 'text-mist-100'}`}>
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-mist-400">{label}</p>
    </div>
  );
}

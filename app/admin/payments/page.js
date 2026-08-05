'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import Link from 'next/link';

export default function AdminPaymentsPage() {
  const { user, loading, token } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'superadmin' && token) {
      Promise.all([
        api.listTournaments(),
        api.adminOverview(token)
      ])
      .then(([tournamentsData, overviewData]) => {
        setTournaments(tournamentsData.tournaments);
        setOverview(overviewData);
      })
      .catch(err => setError(err.message));
    }
  }, [user, token]);

  if (loading) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">Revenue & Payments</h1>
          <p className="text-sm text-mist-400">Track entry fees and platform revenue.</p>
        </div>
      </div>

      {error && <p className="mb-6 rounded-md bg-signal-red/10 p-4 text-sm text-signal-red border border-signal-red/20">{error}</p>}

      {overview && (
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💰</span>
              <span className="flex h-3 w-3 rounded-full bg-signal-teal animate-pulse" />
            </div>
            <p className="font-mono text-4xl font-black tracking-tight text-signal-teal mb-2">
              ₹{overview.totalRevenue}
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-mist-400">Gross Revenue Generated</p>
          </div>
          
          <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🏆</span>
            </div>
            <p className="font-mono text-4xl font-black tracking-tight text-mist-100 mb-2">
              {tournaments.filter(t => t.entryFee > 0).length}
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-mist-400">Paid Tournaments</p>
          </div>
        </div>
      )}

      <h2 className="font-display text-xl font-semibold text-mist-100 mb-4">Revenue Breakdown by Tournament</h2>
      
      <div className="overflow-x-auto rounded-xl border border-ink-700 bg-ink-900/60 shadow-xl">
        <table className="min-w-full divide-y divide-ink-700 text-sm">
          <thead className="bg-ink-950/80">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-mist-400 uppercase tracking-wider text-xs">Tournament</th>
              <th className="px-6 py-4 text-left font-medium text-mist-400 uppercase tracking-wider text-xs">Entry Fee</th>
              <th className="px-6 py-4 text-left font-medium text-mist-400 uppercase tracking-wider text-xs">Registered Teams</th>
              <th className="px-6 py-4 text-right font-medium text-mist-400 uppercase tracking-wider text-xs">Total Collected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/50">
            {tournaments.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-mist-400">No tournaments found.</td>
              </tr>
            )}
            {tournaments.map(t => {
              const totalCollected = (t.teams?.length || 0) * (t.entryFee || 0);
              return (
                <tr key={t._id} className="hover:bg-ink-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/tournaments/${t._id}`} className="font-medium text-mist-100 hover:text-signal-violet transition-colors">
                      {t.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-mist-400">
                    {t.entryFee > 0 ? `₹${t.entryFee}` : 'Free'}
                  </td>
                  <td className="px-6 py-4 text-mist-400">
                    {t.teams?.length || 0} teams
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-signal-teal">
                    ₹{totalCollected}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

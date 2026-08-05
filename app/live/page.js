'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function LivePage() {
  const [liveTournaments, setLiveTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLiveTournaments() {
      try {
        const { tournaments } = await api.listTournaments('?status=in_progress');
        setLiveTournaments(tournaments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveTournaments();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-signal-teal text-sm font-bold tracking-widest uppercase">
          <span className="h-2 w-2 animate-pulse rounded-full bg-signal-teal" /> Live Now
        </span>
        <h1 className="font-display text-3xl font-semibold text-mist-100">Live Tournaments & Results</h1>
      </div>

      <p className="mb-10 text-mist-400 max-w-2xl">
        Watch the action unfold in real-time. Select a live tournament to view its active bracket, live match scores, and advancing teams.
      </p>

      {error && <p className="text-signal-red text-sm mb-6 bg-signal-red/10 border border-signal-red/20 p-4 rounded-lg">{error}</p>}
      
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 rounded-lg bg-ink-800/50"></div>
          ))}
        </div>
      ) : liveTournaments.length === 0 ? (
        <div className="rounded-lg border border-ink-700 bg-ink-900/50 p-12 text-center">
          <span className="text-4xl block mb-4 opacity-50">😴</span>
          <h3 className="font-display text-lg font-semibold text-mist-100">No live tournaments</h3>
          <p className="mt-2 text-sm text-mist-400">There are no tournaments currently in progress.</p>
          <Link href="/tournaments" className="mt-6 inline-block text-signal-violet hover:text-mist-100 text-sm font-medium transition-colors">
            Browse upcoming tournaments →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {liveTournaments.map(tournament => (
            <Link
              key={tournament._id}
              href={`/tournaments/${tournament._id}`}
              className="group block rounded-lg border border-signal-teal/30 bg-ink-900/40 p-6 hover:border-signal-teal hover:bg-ink-900/80 transition-all hover:-translate-y-1 shadow-lg shadow-signal-teal/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-signal-teal/10 rotate-45 translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500 rounded-3xl" />
              <p className="font-mono text-xs uppercase tracking-wide text-signal-teal mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-teal animate-pulse" />
                {tournament.game}
              </p>
              <h3 className="font-display text-xl font-semibold text-mist-100 group-hover:text-white transition-colors">{tournament.name}</h3>
              <div className="mt-4 flex gap-4 text-xs font-medium text-mist-400">
                <span className="bg-ink-950 px-2 py-1 rounded-md border border-ink-800">{tournament.teams?.length || 0} Teams</span>
                <span className="bg-ink-950 px-2 py-1 rounded-md border border-ink-800">Prize: ₹{tournament.prizePool}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

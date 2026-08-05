'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import Link from 'next/link';

export default function AdminTournamentsPage() {
  const { user, loading } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('');
  const [gameFilter, setGameFilter] = useState('');

  useEffect(() => {
    if (user?.role === 'superadmin') {
      api.listTournaments()
        .then(data => setTournaments(data.tournaments))
        .catch(err => setError(err.message));
    }
  }, [user]);

  if (loading) return null;

  const filteredTournaments = tournaments
    .filter(t => (gameFilter ? t.game === gameFilter : true))
    .filter(t => (statusFilter ? t.status === statusFilter : true));

  const games = [...new Set(tournaments.map(t => t.game))];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">Tournament Management</h1>
          <p className="text-sm text-mist-400">View and manage all tournaments across the platform.</p>
        </div>
        <Link 
          href="/tournaments/new" 
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-signal-violet px-5 py-2.5 text-sm font-bold text-ink-950 transition-all hover:bg-signal-violet/90 shadow-[0_0_15px_rgba(113,84,255,0.2)]"
        >
          <span>➕</span> Create Tournament
        </Link>
      </div>

      {error && <p className="mb-6 rounded-md bg-signal-red/10 p-4 text-sm text-signal-red border border-signal-red/20">{error}</p>}

      <div className="mb-6 flex flex-wrap gap-4">
        <select 
          value={gameFilter} 
          onChange={(e) => setGameFilter(e.target.value)}
          className="bg-ink-900 border border-ink-700 rounded-md px-4 py-2 text-sm text-mist-200 focus:outline-none focus:border-signal-violet shadow-sm"
        >
          <option value="">All Games</option>
          {games.map(game => (
            <option key={game} value={game}>{game}</option>
          ))}
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-ink-900 border border-ink-700 rounded-md px-4 py-2 text-sm text-mist-200 focus:outline-none focus:border-signal-violet shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="registration_open">Registration Open</option>
          <option value="registration_closed">Registration Closed</option>
          <option value="in_progress">In Progress</option>
          <option value="paused">Paused</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="divide-y divide-ink-700/50 rounded-xl border border-ink-700 bg-ink-900/60 shadow-xl overflow-hidden">
        {filteredTournaments.length === 0 && (
          <p className="p-10 text-center text-sm text-mist-400">No tournaments found matching criteria.</p>
        )}
        {filteredTournaments.map((t) => (
          <Link key={t._id} href={`/tournaments/${t._id}`} className="focus-ring flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-ink-800/60 transition-colors gap-4">
            <div>
              <p className="text-lg font-bold text-mist-100 group-hover:text-signal-violet transition-colors">{t.name}</p>
              <div className="flex items-center gap-4 mt-2">
                <p className="font-mono text-xs text-mist-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-teal" />
                  {t.game}
                </p>
                <p className="font-mono text-xs text-signal-teal flex items-center gap-1.5 uppercase tracking-wide">
                  <span>💰</span> ₹{t.prizePool}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-md border border-ink-700 text-[10px] uppercase font-bold tracking-widest bg-ink-950 ${
                t.status === 'in_progress' ? 'text-signal-violet' :
                t.status === 'registration_open' ? 'text-signal-teal' :
                'text-mist-400'
              }`}>
                {t.status.replace('_', ' ')}
              </span>
              <p className="text-mist-400 text-xs font-mono">
                {t.teams?.length || 0} / {t.maxTeams} Teams
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

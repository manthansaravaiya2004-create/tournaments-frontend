'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { api } from '../../../lib/api';

export default function MyTeamsPage() {
  const { user, token, loading } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;

    async function fetchMyTeams() {
      try {
        const data = await api.getMyTeams(token);
        setTeams(data.teams || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTeams(false);
      }
    }

    fetchMyTeams();
  }, [loading, token]);

  if (loading || loadingTeams) {
    return <div className="p-8 text-mist-400">Loading your teams...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 animate-slideUp">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-3">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal-lime to-signal-teal">Registered Teams</span>
        </h1>
        <p className="text-base text-mist-400 font-medium tracking-wide">Track all your tournament registrations and results.</p>
      </div>
      
      {error && <p className="mb-6 rounded-md border border-signal-red/40 bg-signal-red/10 p-4 text-sm text-signal-red">{error}</p>}

      {teams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-600 py-16 text-center bg-ink-900/40">
          <p className="text-mist-400 mb-4">You haven't registered for any tournaments yet.</p>
          <Link href="/tournaments" className="inline-flex items-center rounded-lg bg-signal-violet px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-600">
            Browse Tournaments
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="hidden md:flex items-center justify-between px-6 py-2 text-xs font-bold uppercase tracking-widest text-mist-400">
            <div className="flex-[2]">Tournament</div>
            <div className="flex-1 text-center">Team Name</div>
            <div className="flex-1 text-center">Role</div>
            <div className="flex-1 text-center">Payment Status</div>
            <div className="flex-1 text-right">Action</div>
          </div>

          {teams.map((team, idx) => {
            const isCaptain = team.captain === user?.id;
            const isTop = idx < 2; // Make the first 2 glow a bit

            return (
              <div 
                key={team._id} 
                className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl px-6 py-4 bg-ink-900/80 backdrop-blur-md transition-all hover:bg-ink-800
                  ${isTop 
                    ? 'border border-signal-lime/50 shadow-[0_0_15px_rgba(212,255,0,0.05)] bg-gradient-to-r from-signal-lime/5 to-transparent' 
                    : 'border border-ink-800 border-l-[3px] border-l-signal-violet shadow-sm'
                  }
                `}
              >
                {/* Tournament Info */}
                <div className="flex-[2] flex flex-col">
                  <span className="font-bold text-mist-100 text-lg">{team.tournament?.name || 'Deleted Tournament'}</span>
                  <span className="text-xs text-signal-violet uppercase font-bold tracking-wider mt-1">{team.tournament?.game}</span>
                </div>
                
                {/* Team Name */}
                <div className="flex-1 text-left md:text-center text-sm font-bold text-mist-200">
                  <span className="md:hidden text-xs uppercase tracking-wider text-mist-400 mr-2">Team:</span>
                  🛡️ {team.name}
                </div>
                
                {/* Role */}
                <div className="flex-1 text-left md:text-center">
                  <span className="md:hidden text-xs uppercase tracking-wider text-mist-400 mr-2">Role:</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isCaptain ? 'text-signal-amber' : 'text-mist-400'}`}>
                    {isCaptain ? '👑 Captain' : 'Player'}
                  </span>
                </div>
                
                {/* Status */}
                <div className="flex-1 text-left md:text-center">
                  <span className="md:hidden text-xs uppercase tracking-wider text-mist-400 mr-2">Status:</span>
                  <span className={`inline-flex items-center rounded bg-ink-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider
                    ${team.paymentStatus === 'paid' || team.paymentStatus === 'waived'
                      ? 'text-signal-lime shadow-[0_0_10px_rgba(212,255,0,0.1)]'
                      : 'text-signal-red shadow-[0_0_10px_rgba(240,89,107,0.1)]'
                    }`}>
                    {team.paymentStatus}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="flex-1 text-left md:text-right mt-2 md:mt-0 border-t md:border-0 border-ink-800 pt-3 md:pt-0 w-full md:w-auto">
                  <Link
                    href={`/tournaments/${team.tournament?._id}`}
                    className="text-signal-teal hover:text-teal-400 transition-colors text-xs font-bold tracking-wider uppercase inline-block"
                  >
                    View Bracket / Results
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

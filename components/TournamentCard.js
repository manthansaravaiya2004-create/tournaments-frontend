'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const statusStyles = {
  draft: 'bg-ink-950/90 text-mist-400 border border-ink-600 backdrop-blur-md shadow-lg',
  registration_open: 'bg-signal-amber text-ink-950 border border-signal-amber animate-pulse shadow-[0_0_15px_rgba(240,184,78,0.5)]',
  registration_closed: 'bg-ink-950/90 text-signal-amber border border-signal-amber/50 backdrop-blur-md shadow-lg',
  in_progress: 'bg-ink-950/90 text-signal-violet border border-signal-violet/50 backdrop-blur-md shadow-lg',
  completed: 'bg-ink-950/90 text-mist-400 border border-ink-600 backdrop-blur-md shadow-lg',
  cancelled: 'bg-ink-950/90 text-signal-red border border-signal-red/50 backdrop-blur-md shadow-lg',
  paused: 'bg-signal-red text-white border border-signal-red shadow-[0_0_15px_rgba(240,89,107,0.5)]',
};

const statusLabel = {
  draft: 'Draft',
  registration_open: 'Registration Open',
  registration_closed: 'Registration Closed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  paused: 'Paused',
};

export default function TournamentCard({ tournament }) {
  const slotsTaken = tournament.teams?.length || 0;
  const [timeLeft, setTimeLeft] = useState('');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (!tournament.startsAt) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(tournament.startsAt);
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft('Started');
        return;
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      
      if (d > 0) setTimeLeft(`${d}d ${h}h`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m`);
      else setTimeLeft(`${m}m`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [tournament.startsAt]);
  
  const formattedDate = tournament.startsAt 
    ? new Date(tournament.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'TBA';

  // Use coverImageUrl or fallback to a stunning gaming stock image
  const bgImage = tournament.coverImageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80';

  return (
    <Link
      href={`/tournaments/${tournament._id}`}
      className="group relative block h-[340px] overflow-hidden rounded-xl border border-ink-700 bg-ink-950 transition-all duration-300 hover:-translate-y-2 hover:border-signal-lime hover:shadow-[0_15px_40px_rgba(212,255,0,0.15)] focus-ring"
    >
      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Darkened Gradients to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-[#000000d9] opacity-95" />
      <div className="absolute inset-0 bg-ink-950/50 group-hover:bg-ink-950/20 transition-colors duration-500" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-between p-5">

        {/* Top Header */}
        <div className="flex items-start justify-between">
          <span className={`rounded-full px-3 py-1 text-[10px]  font-bold uppercase tracking-widest ${statusStyles[tournament.status] || ''}`}>
            {statusLabel[tournament.status] || tournament.status}
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-ink-950/90 px-3 py-1 border border-ink-600 backdrop-blur-md shadow-lg">
            <span className="text-xs font-bold text-mist-100">
              {slotsTaken}/{tournament.maxTeams}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-mist-400">Teams</span>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="mt-auto">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-signal-violet bg-signal-violet/15 border border-signal-violet/30 px-2.5 py-1 rounded-md mb-1 font-bold backdrop-blur-md">
              {tournament.game}
            </span>
            <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-mist-300 bg-ink-900/80 border border-ink-700 px-2.5 py-1 rounded-md mb-1 font-bold backdrop-blur-md">
              🕒 {mounted && timeLeft && timeLeft !== 'Started' ? `In ${timeLeft}` : (mounted && timeLeft === 'Started' ? 'Live' : formattedDate)}
            </span>
            <h3 className="w-full font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-signal-lime to-signal-teal line-clamp-2 leading-tight tracking-tight drop-shadow-lg group-hover:drop-shadow-[0_0_10px_rgba(212,255,0,0.4)] transition-all">
              {tournament.name}
            </h3>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-mist-400 mb-1">Prize Pool</p>
              <p className="font-mono text-lg font-bold text-signal-teal drop-shadow-md">
                {tournament.prizePool > 0 ? `₹${tournament.prizePool}` : 'TBD'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-mist-400 mb-1">Entry Fee</p>
              <p className="font-mono text-lg font-bold text-mist-100">
                {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [matchIdx, setMatchIdx] = useState(0);

  const matches = [
    {
      round: 'WINNERS FINAL',
      teams: [
        { seed: '1', name: 'Nova Fracture', score: 2, active: true },
        { seed: '5', name: 'Iron Wake', score: 1, active: false },
      ]
    },
    {
      round: 'LOSERS SEMI',
      teams: [
        { seed: '3', name: 'Cloud Surge', score: 0, active: false },
        { seed: '2', name: 'Neon Knights', score: 2, active: true },
      ]
    },
    {
      round: 'GRAND FINAL',
      teams: [
        { seed: '1', name: 'Nova Fracture', score: 1, active: true },
        { seed: '2', name: 'Neon Knights', score: 0, active: false },
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchIdx((prev) => (prev + 1) % matches.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [matches.length]);

  const currentMatch = matches[matchIdx];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-700/60 bg-grid-fade">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-up">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-signal-teal">
              Round 1 · Match 04 · Live
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-mist-100 md:text-5xl">
              Run tournaments people actually want to play in.
            </h1>
            <p className="mt-5 max-w-md text-mist-400">
              Open registration, seed the bracket, and report results in real time —
              built for esports organizers who don't want to run brackets in a spreadsheet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tournaments"
                className="focus-ring rounded-md bg-signal-violet px-5 py-3 text-sm font-medium text-ink-950 hover:bg-signal-violet/90 transition-colors shadow-lg shadow-signal-violet/20"
              >
                Browse tournaments
              </Link>
              <Link
                href="/register"
                className="focus-ring rounded-md border border-ink-600 px-5 py-3 text-sm font-medium text-mist-200 hover:border-signal-violet hover:text-mist-100 transition-all hover:bg-signal-violet/5"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="animate-fade-up animation-delay-200 animate-float">
            <div className="mx-auto w-full max-w-sm rounded-lg border border-signal-violet/30 bg-ink-900/80 p-5 shadow-2xl animate-glow-pulse backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between text-xs text-mist-400 transition-all">
                <span className="font-mono transition-opacity duration-500">BO3 · {currentMatch.round}</span>
                <span className="flex items-center gap-1.5 text-signal-teal">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-teal" /> LIVE
                </span>
              </div>
              <div className="space-y-3 relative h-[120px]">
                {currentMatch.teams.map((t, index) => (
                  <div
                    key={`${t.name}-${matchIdx}`}
                    className={`absolute w-full flex items-center justify-between rounded-md border px-4 py-3 transition-all duration-700 ease-in-out ${
                      t.active ? 'border-signal-violet/50 bg-signal-violet/10 shadow-inner' : 'border-ink-700 bg-ink-800/60'
                    }`}
                    style={{ top: index === 0 ? '0' : '64px', animation: 'fade-up 0.5s ease-out forwards' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-mist-400">#{t.seed}</span>
                      <span className="text-sm font-medium text-mist-100">{t.name}</span>
                    </div>
                    <span className="font-mono text-lg font-semibold text-mist-100">{t.score}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-mist-400 text-center italic transition-opacity">Simulated live feed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { label: 'Open registration', body: 'Set an entry fee, a cap on teams, and a registration window — the platform handles the rest.' },
            { label: 'Seeded brackets', body: 'Single-elimination brackets are generated automatically once registration closes, with byes handled for you.' },
            { label: 'Live results', body: 'Organizers report scores match by match; winners advance instantly and the bracket updates live.' },
          ].map((f, i) => (
            <div 
              key={f.label} 
              className={`animate-fade-up rounded-lg border border-ink-700 bg-ink-900/40 p-6 hover:border-signal-violet/50 hover:bg-ink-900/80 transition-all cursor-default shadow-lg hover:-translate-y-1 ${
                i === 0 ? 'animation-delay-200' : i === 1 ? 'animation-delay-400' : 'animation-delay-600'
              }`}
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            >
              <h3 className="font-display text-base font-semibold text-mist-100 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-violet opacity-70"></span>
                {f.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-ink-950 min-h-screen selection:bg-signal-violet/30 selection:text-white">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-signal-violet/20 blur-[150px] rounded-full animate-float mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-signal-teal/10 blur-[120px] rounded-full animate-float-delayed mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-signal-amber/10 blur-[150px] rounded-full animate-float mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay" />
        <div className="absolute inset-0 bg-grid-fade" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex items-center justify-center min-h-[90vh]">
        <div className="text-center max-w-5xl mx-auto animate-slideUp">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-signal-teal"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-mist-200">Over 500+ Daily Matches</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-black leading-tight tracking-tighter text-white mb-6 drop-shadow-2xl">
            Play.<br className="md:hidden" /> Compete.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal-violet via-signal-teal to-signal-violet bg-[length:200%_auto] animate-pulseGlow">
              Dominate.
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-2xl text-mist-200 font-medium leading-relaxed mb-10">
            The premium esports platform for competitive players. Enter daily tournaments, climb the leaderboards, and win real cash prizes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/register"
              className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-signal-violet px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(178,133,240,0.6)] active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative drop-shadow-md">Start Playing Free</span>
            </Link>
            <Link
              href="/tournaments"
              className="w-full sm:w-auto rounded-xl border border-ink-600 bg-ink-900/40 backdrop-blur-md px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-mist-100 transition-all hover:bg-ink-800 hover:border-signal-teal hover:text-white hover:shadow-[0_0_20px_rgba(70,225,184,0.2)] active:scale-95"
            >
              Explore Tournaments
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Stats Strip */}
      <section className="relative z-10 border-y border-ink-800 bg-ink-900/50 backdrop-blur-xl py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox number="₹2.5M+" label="Paid Out Monthly" />
          <StatBox number="150K" label="Active Gamers" />
          <StatBox number="12,000+" label="Tournaments Hosted" />
          <StatBox number="< 5min" label="Payout Time" />
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6">Built for <span className="text-signal-teal">Champions</span></h2>
            <p className="text-xl text-mist-400 font-medium max-w-2xl mx-auto">Everything you need to compete at the highest level, engineered into one beautiful platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🏆"
              title="Automated Brackets"
              description="No more waiting around. Our system automatically generates seeded brackets the second registration closes."
              delay="300ms"
            />
            <FeatureCard 
              icon="⚡"
              title="Instant Payouts"
              description="Win your match, get paid. Winnings are automatically credited to your wallet for instant withdrawal via UPI."
              delay="400ms"
              featured={true}
            />
            <FeatureCard 
              icon="🛡️"
              title="Anti-Cheat & Dispute"
              description="Fair play is guaranteed. Dedicated admins and automated screenshot verification keep the competition clean."
              delay="500ms"
            />
          </div>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section className="relative z-10 py-24 bg-ink-900/30 border-y border-ink-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center text-white mb-20">Your Path to <span className="text-signal-violet">Victory</span></h2>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-signal-violet/0 via-signal-violet/50 to-signal-violet/0" />
            
            <Step number="01" title="Register" desc="Create your free account and link your game IDs." />
            <Step number="02" title="Join" desc="Find a tournament that matches your skill level and schedule." />
            <Step number="03" title="Compete" desc="Play your matches and report scores directly on the platform." />
            <Step number="04" title="Earn" desc="Win your bracket and withdraw your cash instantly." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-signal-violet/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-ink-800/40 border border-ink-700/50 p-12 md:p-20 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-signal-violet/20 to-signal-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <h2 className="relative font-display text-4xl md:text-5xl font-black text-white mb-6">Ready to drop in?</h2>
          <p className="relative text-lg text-mist-200 mb-10 max-w-xl mx-auto">Join the fastest-growing esports community today. Thousands of players are waiting.</p>
          
          <Link
            href="/register"
            className="relative inline-block overflow-hidden rounded-xl bg-white px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] text-ink-950 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Create Free Account
          </Link>
        </div>
      </section>

    </div>
  );
}

function StatBox({ number, label }) {
  return (
    <div className="text-center group">
      <p className="font-display text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2 group-hover:text-signal-teal transition-colors duration-300">{number}</p>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-mist-400">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay, featured }) {
  return (
    <div 
      className={`relative group rounded-3xl border p-10 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-slideUp
        ${featured 
          ? 'bg-gradient-to-b from-ink-800 to-ink-900 border-signal-violet/50 hover:border-signal-violet shadow-[0_0_30px_rgba(178,133,240,0.15)]' 
          : 'bg-ink-900/60 border-ink-700/60 hover:border-mist-400 hover:bg-ink-800/80 backdrop-blur-xl'
        }`}
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      {featured && <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-signal-violet to-transparent" />}
      
      <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-inner transition-colors duration-500
        ${featured ? 'bg-signal-violet/20 border-2 border-signal-violet/50' : 'bg-ink-800 border border-ink-600 group-hover:border-signal-teal/50 group-hover:bg-signal-teal/10'}
      `}>
        {icon}
      </div>
      <h3 className="font-display text-2xl font-bold text-white mb-4">
        {title}
      </h3>
      <p className="text-mist-400 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="relative text-center z-10 group">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-ink-950 border-4 border-ink-800 mb-6 group-hover:border-signal-violet group-hover:scale-110 transition-all duration-500 shadow-xl">
        <span className="font-display text-3xl font-black text-mist-400 group-hover:text-white transition-colors">{number}</span>
      </div>
      <h4 className="font-display text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-sm text-mist-400 font-medium px-4">{desc}</p>
    </div>
  );
}

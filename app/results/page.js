import Link from 'next/link';
import { api } from '../../lib/api';

export const dynamic = 'force-dynamic';

export default async function ResultsPage() {
  let tournaments = [];
  let loadError = null;

  try {
    // Fetch tournaments that have results uploaded
    const data = await api.listTournaments("?hasResults=true");
    tournaments = data.tournaments;
  } catch (err) {
    loadError = err.message;
  }

  return (
    <div className="bg-ink-950 min-h-screen pt-32 pb-20 px-6">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-signal-lime/10 blur-[120px] rounded-full animate-float-delayed mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-signal-violet/10 blur-[150px] rounded-full animate-float mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-slideUp">
          <span className="inline-block rounded-full bg-signal-lime/10 border border-signal-lime/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-signal-lime mb-6 shadow-[0_0_20px_rgba(212,255,0,0.2)]">
            Wall of Fame
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6">Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal-lime to-signal-teal">Results</span></h1>
          <p className="text-mist-200 text-lg md:text-xl max-w-2xl mx-auto">View the latest standings and final results from concluded tournaments.</p>
        </div>

        {loadError && (
          <p className="mx-auto max-w-2xl text-center rounded-xl border border-signal-red/40 bg-signal-red/10 p-6 text-signal-red">
            Failed to load results: {loadError}
          </p>
        )}

        {!loadError && tournaments.length === 0 && (
          <div className="mx-auto max-w-2xl text-center rounded-2xl border border-dashed border-ink-600 py-20 bg-ink-900/40 backdrop-blur-md">
            <p className="text-mist-400 text-lg font-medium">No results have been uploaded yet.</p>
          </div>
        )}

        {tournaments.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament, i) => (
              <div 
                key={tournament._id} 
                className="group relative flex flex-col rounded-3xl bg-ink-900/60 border border-ink-700/60 backdrop-blur-xl p-8 hover:-translate-y-2 hover:border-signal-lime hover:shadow-[0_15px_40px_rgba(212,255,0,0.15)] transition-all duration-500 animate-slideUp"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-signal-violet mb-2 font-bold">{tournament.game}</p>
                  <h3 className="font-display text-2xl font-bold text-white leading-tight">{tournament.name}</h3>
                </div>
                
                <div className="flex-grow flex flex-col gap-3 mb-8">
                  {tournament.resultFiles.map((file, idx) => (
                    <a
                      key={file._id || idx}
                      href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${file.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-ink-800 border border-ink-600 hover:border-signal-lime hover:bg-signal-lime/5 transition-colors group/link"
                    >
                      <span className="text-xl">📄</span>
                      <span className="text-sm font-bold text-mist-100 group-hover/link:text-signal-lime truncate">{file.name}</span>
                    </a>
                  ))}
                </div>

                <Link
                  href={`/tournaments/${tournament._id}`}
                  className="mt-auto w-full text-center rounded-xl bg-ink-950 border border-ink-700 px-6 py-4 text-sm font-bold uppercase tracking-widest text-mist-200 transition-colors hover:border-signal-violet hover:text-white"
                >
                  View Tournament Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

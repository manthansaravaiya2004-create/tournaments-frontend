import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-700/60 bg-grid-fade">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
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
                className="focus-ring rounded-md bg-signal-violet px-5 py-3 text-sm font-medium text-ink-950 hover:opacity-90"
              >
                Browse tournaments
              </Link>
              <Link
                href="/register"
                className="focus-ring rounded-md border border-ink-600 px-5 py-3 text-sm font-medium text-mist-200 hover:border-signal-violet hover:text-mist-100"
              >
                Create an account
              </Link>
            </div>
          </div>

          {/* Signature element: a live scoreboard match card */}
          <div className="mx-auto w-full max-w-sm rounded-lg border border-ink-600 bg-ink-900/80 p-5 shadow-2xl shadow-black/40">
            <div className="mb-4 flex items-center justify-between text-xs text-mist-400">
              <span className="font-mono">BO3 · WINNERS FINAL</span>
              <span className="flex items-center gap-1.5 text-signal-teal">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-teal" /> LIVE
              </span>
            </div>
            <div className="space-y-3">
              {[
                { seed: '1', name: 'Nova Fracture', score: 2, active: true },
                { seed: '5', name: 'Iron Wake', score: 1, active: false },
              ].map((t) => (
                <div
                  key={t.name}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                    t.active ? 'border-signal-violet/50 bg-signal-violet/10' : 'border-ink-700 bg-ink-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-mist-400">#{t.seed}</span>
                    <span className="text-sm font-medium text-mist-100">{t.name}</span>
                  </div>
                  <span className="font-mono text-lg font-semibold text-mist-100">{t.score}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-mist-400">Next: winner advances to Grand Final</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { label: 'Open registration', body: 'Set an entry fee, a cap on teams, and a registration window — the platform handles the rest.' },
            { label: 'Seeded brackets', body: 'Single-elimination brackets are generated automatically once registration closes, with byes handled for you.' },
            { label: 'Live results', body: 'Organizers report scores match by match; winners advance instantly and the bracket updates live.' },
          ].map((f) => (
            <div key={f.label} className="rounded-lg border border-ink-700 bg-ink-900/50 p-6">
              <h3 className="font-display text-base font-semibold text-mist-100">{f.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

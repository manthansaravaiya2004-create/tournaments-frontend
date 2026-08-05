import Link from 'next/link';

const statusStyles = {
  draft: 'text-mist-400 border-ink-600',
  registration_open: 'text-signal-teal border-signal-teal/40 bg-signal-teal/10',
  registration_closed: 'text-signal-amber border-signal-amber/40 bg-signal-amber/10',
  in_progress: 'text-signal-violet border-signal-violet/40 bg-signal-violet/10',
  completed: 'text-mist-400 border-ink-600',
  cancelled: 'text-signal-red border-signal-red/40 bg-signal-red/10',
};

const statusLabel = {
  draft: 'Draft',
  registration_open: 'Registration open',
  registration_closed: 'Registration closed',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function TournamentCard({ tournament }) {
  const slotsTaken = tournament.teams?.length || 0;

  return (
    <Link
      href={`/tournaments/${tournament._id}`}
      className="focus-ring block rounded-lg border border-ink-700 bg-ink-900/50 p-5 transition-colors hover:border-signal-violet/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-mist-400">{tournament.game}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-mist-100">{tournament.name}</h3>
        </div>
        <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[tournament.status] || ''}`}>
          {statusLabel[tournament.status] || tournament.status}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-mist-400">
        <span>{slotsTaken}/{tournament.maxTeams} teams</span>
        <span className="font-mono">{tournament.entryFee > 0 ? `$${tournament.entryFee} entry` : 'Free entry'}</span>
      </div>
      {tournament.prizePool > 0 && (
        <p className="mt-2 font-mono text-sm text-signal-teal">${tournament.prizePool} prize pool</p>
      )}
    </Link>
  );
}

import Link from 'next/link';
import { api } from '../../lib/api';
import TournamentCard from '../../components/TournamentCard';
import CreateTournamentButton from '../../components/CreateTournamentButton';

export default async function TournamentsPage() {
  let tournaments = [];
  let loadError = null;
  try {
    const data = await api.listTournaments();
    tournaments = data.tournaments;
  } catch (err) {
    loadError = err.message;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-100">Tournaments</h1>
          <p className="mt-1 text-sm text-mist-400">Browse open brackets and upcoming events.</p>
        </div>
        <CreateTournamentButton />
      </div>

      {loadError && (
        <p className="mt-8 rounded-md border border-signal-red/40 bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
          Couldn't reach the API: {loadError}. Make sure the backend is running and NEXT_PUBLIC_API_URL is set.
        </p>
      )}

      {!loadError && tournaments.length === 0 && (
        <div className="mt-16 rounded-lg border border-dashed border-ink-600 py-16 text-center">
          <p className="text-mist-400">No tournaments yet. Be the first to create one.</p>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((t) => (
          <TournamentCard key={t._id} tournament={t} />
        ))}
      </div>
    </div>
  );
}

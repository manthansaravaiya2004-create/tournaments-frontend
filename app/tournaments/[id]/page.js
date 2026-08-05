'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import BracketView from '../../../components/BracketView';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reportingMatch, setReportingMatch] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', tag: '' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.getTournament(id);
      setTournament(data.tournament);
      setMatches(data.matches);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const isOrganizer = user && tournament && (user.role === 'admin' || user.id === tournament.organizer?._id);

  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const { team } = await api.registerTeam(id, teamForm, token);
      setNotice(`Team "${team.name}" registered.`);
      if (tournament.entryFee > 0) {
        const result = await api.checkout(team._id, token);
        setNotice(result.mock ? `${result.message}` : 'Redirecting to checkout…');
        if (result.checkoutUrl) window.location.href = result.checkoutUrl;
      }
      setTeamForm({ name: '', tag: '' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleGenerateBracket = async () => {
    setBusy(true);
    setError('');
    try {
      await api.generateBracket(id, token);
      setNotice('Bracket generated.');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitResult = async (scoreA, scoreB, winnerId) => {
    setBusy(true);
    setError('');
    try {
      await api.reportResult(reportingMatch._id, { scoreA, scoreB, winner: winnerId }, token);
      setReportingMatch(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !tournament) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-sm text-signal-red">{error}</p>;
  }
  if (!tournament) return <p className="mx-auto max-w-2xl px-6 py-16 text-sm text-mist-400">Loading…</p>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-wide text-mist-400">{tournament.game}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-mist-100">{tournament.name}</h1>
      {tournament.description && <p className="mt-3 max-w-2xl text-sm text-mist-400">{tournament.description}</p>}

      <div className="mt-6 flex flex-wrap gap-6 font-mono text-sm text-mist-200">
        <span>{tournament.teams?.length || 0}/{tournament.maxTeams} teams</span>
        <span>{tournament.entryFee > 0 ? `$${tournament.entryFee} entry` : 'Free entry'}</span>
        {tournament.prizePool > 0 && <span className="text-signal-teal">${tournament.prizePool} prize pool</span>}
        <span className="capitalize">{tournament.status.replace('_', ' ')}</span>
      </div>

      {notice && <p className="mt-4 rounded-md border border-signal-teal/40 bg-signal-teal/10 px-3 py-2 text-sm text-signal-teal">{notice}</p>}
      {error && <p className="mt-4 rounded-md border border-signal-red/40 bg-signal-red/10 px-3 py-2 text-sm text-signal-red">{error}</p>}

      {isOrganizer && !tournament.bracketGenerated && (
        <button
          onClick={handleGenerateBracket}
          disabled={busy}
          className="focus-ring mt-6 rounded-md bg-signal-violet px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50"
        >
          Generate bracket
        </button>
      )}

      {user && !tournament.bracketGenerated && tournament.status === 'registration_open' && (
        <form onSubmit={handleRegisterTeam} className="mt-8 max-w-sm rounded-lg border border-ink-700 bg-ink-900/50 p-5">
          <h2 className="font-display text-sm font-semibold text-mist-100">Register a team</h2>
          <div className="mt-4 space-y-3">
            <input
              required
              placeholder="Team name"
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100"
            />
            <input
              placeholder="Tag (optional)"
              maxLength={6}
              value={teamForm.tag}
              onChange={(e) => setTeamForm({ ...teamForm, tag: e.target.value })}
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100"
            />
            <button
              type="submit"
              disabled={busy}
              className="focus-ring w-full rounded-md bg-signal-teal px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50"
            >
              {tournament.entryFee > 0 ? `Register & pay $${tournament.entryFee}` : 'Register team'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-12">
        <h2 className="mb-5 font-display text-lg font-semibold text-mist-100">Bracket</h2>
        <BracketView matches={matches} canReport={isOrganizer} onReportResult={setReportingMatch} />
      </div>

      {reportingMatch && (
        <ReportModal match={reportingMatch} busy={busy} onClose={() => setReportingMatch(null)} onSubmit={submitResult} />
      )}
    </div>
  );
}

function ReportModal({ match, busy, onClose, onSubmit }) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [winner, setWinner] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-lg border border-ink-600 bg-ink-900 p-6">
        <h3 className="font-display text-base font-semibold text-mist-100">Report result</h3>
        <div className="mt-4 space-y-3">
          <ScoreRow label={match.teamA?.name || 'Team A'} value={scoreA} onChange={setScoreA} />
          <ScoreRow label={match.teamB?.name || 'Team B'} value={scoreB} onChange={setScoreB} />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist-400">Winner</label>
            <select
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100"
            >
              <option value="">Select winner</option>
              <option value={match.teamA?._id}>{match.teamA?.name}</option>
              <option value={match.teamB?._id}>{match.teamB?.name}</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="focus-ring flex-1 rounded-md border border-ink-600 py-2 text-sm text-mist-200">
            Cancel
          </button>
          <button
            disabled={!winner || busy}
            onClick={() => onSubmit(scoreA, scoreB, winner)}
            className="focus-ring flex-1 rounded-md bg-signal-violet py-2 text-sm font-medium text-ink-950 disabled:opacity-50"
          >
            Save result
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="truncate text-sm text-mist-200">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-ring w-20 rounded-md border border-ink-600 bg-ink-900 px-2 py-1.5 text-center font-mono text-sm text-mist-100"
      />
    </div>
  );
}

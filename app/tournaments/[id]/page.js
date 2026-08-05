'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import BracketView from '../../../components/BracketView';
import { io } from 'socket.io-client';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reportingMatch, setReportingMatch] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', tag: '' });
  const [busy, setBusy] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [socketNotice, setSocketNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const [data, teamsData] = await Promise.all([
        api.getTournament(id),
        api.listTeams(id)
      ]);
      setTournament(data.tournament);
      setMatches(data.matches);
      setTeams(teamsData.teams || []);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000';
    const socket = io(socketUrl);

    socket.on('connect', () => {
      socket.emit('join_tournament', id);
    });

    socket.on('tournament_state_changed', (data) => {
      setSocketNotice(data.message);
      load();
      setTimeout(() => setSocketNotice(''), 10000);
    });

    return () => socket.disconnect();
  }, [id, load]);

  const isOrganizer = user && tournament && (user.role === 'admin' || user.role === 'superadmin' || user.id === tournament.organizer?._id);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (tournament.entryFee > 0) {
      setShowPayment(true);
    } else {
      executeRegistration();
    }
  };

  const executeRegistration = async () => {
    setBusy(true);
    setError('');
    setNotice('');
    setShowPayment(false);
    try {
      const { team } = await api.registerTeam(id, teamForm, token);
      setNotice(`Team "${team.name}" registered successfully!`);
      setTeamForm({ name: '', tag: '' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePayment = async (teamId, status) => {
    setBusy(true);
    try {
      await api.updatePaymentStatus(teamId, status, token);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to remove this team?')) return;
    setBusy(true);
    try {
      await api.withdrawTeam(teamId, token);
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

  const handleUpdateState = async (action, delayMinutes = 0) => {
    setBusy(true);
    try {
      await api.updateTournamentState(id, { action, delayMinutes }, token);
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
      {socketNotice && (
        <div className="mb-8 rounded-lg bg-signal-violet/20 border-l-4 border-signal-violet p-4 shadow-lg animate-pulse transition-all">
          <div className="flex items-center">
            <span className="text-xl mr-3">🔔</span>
            <p className="font-semibold text-mist-100">{socketNotice}</p>
          </div>
        </div>
      )}

      <p className="font-mono text-xs uppercase tracking-wide text-mist-400">{tournament.game}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-mist-100">{tournament.name}</h1>
      {tournament.description && <p className="mt-3 max-w-2xl text-sm text-mist-400">{tournament.description}</p>}

      <div className="mt-6 flex flex-wrap gap-6 font-mono text-sm text-mist-200">
        <span>{tournament.teams?.length || 0}/{tournament.maxTeams} teams</span>
        <span>{tournament.entryFee > 0 ? `₹${tournament.entryFee} entry` : 'Free entry'}</span>
        {tournament.prizePool > 0 && <span className="text-signal-teal">₹{tournament.prizePool} prize pool</span>}
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

      {isOrganizer && (
        <div className="mt-6 flex flex-wrap gap-3 rounded-lg border border-ink-700 bg-ink-900/50 p-4">
          <p className="w-full text-xs font-semibold text-mist-400 uppercase tracking-wider mb-1">Admin State Controls</p>
          <button
            onClick={() => handleUpdateState('start')}
            disabled={busy || tournament.status === 'in_progress'}
            className="focus-ring rounded-md bg-signal-teal px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50 transition-colors"
          >
            Start
          </button>
          <button
            onClick={() => handleUpdateState('pause')}
            disabled={busy || tournament.status === 'paused'}
            className="focus-ring rounded-md bg-signal-violet px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50 transition-colors"
          >
            Pause
          </button>
          <button
            onClick={() => {
              const mins = window.prompt('Enter delay in minutes:', '30');
              if (mins && !isNaN(mins)) handleUpdateState('delay', Number(mins));
            }}
            disabled={busy}
            className="focus-ring rounded-md bg-mist-200 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-mist-300 disabled:opacity-50 transition-colors"
          >
            Delay Time
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel the entire tournament?')) handleUpdateState('cancel');
            }}
            disabled={busy || tournament.status === 'cancelled'}
            className="focus-ring rounded-md bg-signal-red px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50 transition-colors ml-auto"
          >
            Cancel Tournament
          </button>
        </div>
      )}

      {user && !tournament.bracketGenerated && tournament.status === 'registration_open' && (
        <form onSubmit={handleRegisterClick} className="mt-8 max-w-sm rounded-lg border border-ink-700 bg-ink-900/50 p-5">
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
              className="focus-ring w-full rounded-md bg-signal-teal px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {tournament.entryFee > 0 ? `Register & pay ₹${tournament.entryFee}` : 'Register team'}
            </button>
          </div>
        </form>
      )}

      {teams.length > 0 && !tournament.bracketGenerated && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-mist-100">Registered Teams</h2>
          <div className="overflow-x-auto rounded-lg border border-ink-700 bg-ink-900/50">
            <table className="min-w-full divide-y divide-ink-700 text-sm">
              <thead className="bg-ink-950/50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-mist-400">Team Name</th>
                  <th className="px-5 py-3 text-left font-medium text-mist-400">Tag</th>
                  <th className="px-5 py-3 text-left font-medium text-mist-400">Registered By</th>
                  <th className="px-5 py-3 text-left font-medium text-mist-400">Payment Status</th>
                  {isOrganizer && <th className="px-5 py-3 text-right font-medium text-mist-400">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700">
                {teams.map(team => (
                  <tr key={team._id} className="hover:bg-ink-800/30 transition-colors">
                    <td className="px-5 py-3 text-mist-100 font-medium">{team.name}</td>
                    <td className="px-5 py-3 text-mist-400">{team.tag || '-'}</td>
                    <td className="px-5 py-3 text-mist-200 flex items-center gap-2">
                      {team.captain?.username}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${team.paymentStatus === 'paid' || team.paymentStatus === 'waived'
                        ? 'bg-signal-teal/10 text-signal-teal border border-signal-teal/20'
                        : 'bg-signal-violet/10 text-signal-violet border border-signal-violet/20'
                        }`}>
                        {team.paymentStatus}
                      </span>
                    </td>
                    {isOrganizer && (
                      <td className="px-5 py-3 text-right space-x-3">
                        {team.paymentStatus === 'pending' && (
                          <button
                            disabled={busy}
                            onClick={() => handleUpdatePayment(team._id, 'paid')}
                            className="text-signal-teal hover:text-teal-400 transition-colors text-xs font-medium disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          disabled={busy}
                          onClick={() => handleRemoveTeam(team._id)}
                          className="text-signal-red hover:text-red-400 transition-colors text-xs font-medium disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="mb-5 font-display text-lg font-semibold text-mist-100">Bracket</h2>
        <BracketView matches={matches} canReport={isOrganizer} onReportResult={setReportingMatch} />
      </div>

      {reportingMatch && (
        <ReportModal match={reportingMatch} busy={busy} onClose={() => setReportingMatch(null)} onSubmit={submitResult} />
      )}

      {showPayment && (
        <PaymentModal
          amount={tournament.entryFee}
          tournamentName={tournament.name}
          teamName={teamForm.name}
          onClose={() => setShowPayment(false)}
          onConfirm={executeRegistration}
        />
      )}
    </div>
  );
}

function PaymentModal({ amount, tournamentName, teamName, onClose, onConfirm }) {
  const transactionNote = encodeURIComponent(`${tournamentName} - Team ${teamName}`);

  // Generate a standard UPI URI for Google Pay / PhonePe / Paytm using the provided UPI ID
  const upiUrl = `upi://pay?pa=parthchauhan417418@okaxis&pn=parth%20Chauhan&am=${amount}&tn=${transactionNote}&cu=INR`;
  // Use a public API to generate the QR code image from the URI
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-ink-600 bg-ink-900 p-8 text-center shadow-2xl">
        <h3 className="font-display text-2xl font-semibold text-mist-100">Complete Payment</h3>
        <p className="mt-2 text-sm text-mist-400">Scan with Google Pay or any UPI app to pay ₹{amount}</p>

        <div className="my-8 flex justify-center">
          <div className="rounded-xl border-4 border-white bg-white p-2 shadow-lg">
            <img src={qrUrl} alt="Google Pay QR Code" className="h-48 w-48 object-contain" />
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="focus-ring w-full rounded-md bg-signal-teal py-3 text-sm font-medium text-ink-950 hover:bg-signal-teal/90 transition-colors shadow-lg shadow-signal-teal/20"
        >
          I have paid ₹{amount}
        </button>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-mist-400 hover:text-mist-200 transition-colors"
        >
          Cancel registration
        </button>
      </div>
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

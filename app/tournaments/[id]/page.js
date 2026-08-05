'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import BracketView from '../../../components/BracketView';
import { io } from 'socket.io-client';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reportingMatch, setReportingMatch] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '', tag: '', instagram: '', telegram: '', players: []
  });
  const [viewTeam, setViewTeam] = useState(null);
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
      setTeamForm(prev => {
        if (prev.players.length === data.tournament.teamSize) return prev;
        return {
          ...prev,
          players: Array(data.tournament.teamSize).fill().map(() => ({ realName: '', inGameName: '', gameUid: '', mobileNumber: '' }))
        };
      });
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

  const executeRegistration = async (upiUtr = '', refundUpiId = '', screenshotFile = null) => {
    setBusy(true);
    setError('');
    setNotice('');
    setShowPayment(false);
    try {
      const payload = { ...teamForm, upiUtr, refundUpiId };
      const { team } = await api.registerTeam(id, payload, token);
      setNotice(`Team "${team.name}" registered successfully!`);
      setTeamForm({
        name: '', tag: '', instagram: '', telegram: '',
        players: Array(tournament.teamSize).fill().map(() => ({ realName: '', inGameName: '', gameUid: '', mobileNumber: '' }))
      });
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

  const handleDeleteTournament = async () => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this tournament and ALL of its teams and matches? This cannot be undone.')) return;
    setBusy(true);
    try {
      await api.deleteTournament(id, token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const uploadRes = await api.uploadDocument(file, token);
      await api.addResultFile(id, { name: uploadRes.name, url: uploadRes.url }, token);
      setNotice('File uploaded successfully');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = null;
    }
  };

  const handleRemoveFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to remove this file?')) return;
    setBusy(true);
    try {
      await api.removeResultFile(id, fileId, token);
      setNotice('File removed');
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

  const hasRegistered = user && teams.some(team =>
    (team.captain && team.captain._id === user.id) ||
    (team.members && team.members.some(member => member._id === user.id))
  );

  const displayTeams = isOrganizer ? teams : teams.filter(team =>
    (team.captain && team.captain._id === user?.id) ||
    (team.members && team.members.some(member => member._id === user?.id))
  );

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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-1.5 border border-ink-700 shadow-md">
          <span className="font-mono text-sm font-bold text-mist-100">{tournament.teams?.length || 0}/{tournament.maxTeams}</span>
          <span className="text-[10px] uppercase tracking-wide text-mist-400">Teams</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-1.5 border border-ink-700 shadow-md">
          <span className="text-[10px] uppercase tracking-wide text-mist-400">Entry</span>
          <span className="font-mono text-sm font-bold text-mist-100">{tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free'}</span>
        </div>
        {tournament.prizePool > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-1.5 border border-signal-teal/30 shadow-[0_0_10px_rgba(45,212,191,0.1)]">
            <span className="text-[10px] uppercase tracking-wide text-signal-teal/70">Prize Pool</span>
            <span className="font-mono text-sm font-bold text-signal-teal drop-shadow-md">₹{tournament.prizePool}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-1.5 border border-ink-700 shadow-md">
          <span className="text-[10px] uppercase tracking-wide text-mist-400">Starts</span>
          <span className="font-mono text-sm font-bold text-mist-100">
            {tournament.startsAt ? new Date(tournament.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'TBA'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-1.5 border border-ink-700 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-mist-100">{tournament.status.replace('_', ' ')}</span>
        </div>
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
            onClick={() => handleUpdateState('open_registration')}
            disabled={busy || tournament.status === 'registration_open'}
            className="focus-ring rounded-md bg-signal-teal px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50 transition-colors"
          >
            Open Reg.
          </button>
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
          <button
            onClick={handleDeleteTournament}
            disabled={busy}
            className="focus-ring rounded-md border border-signal-red bg-transparent px-4 py-2 text-sm font-medium text-signal-red hover:bg-signal-red/10 disabled:opacity-50 transition-colors"
          >
            Delete Tournament
          </button>

          <div className="relative border-l border-ink-700 pl-3 ml-1 flex items-center">
            <input
              type="file"
              id="result-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
              onChange={handleFileUpload}
              disabled={busy}
            />
            <label
              htmlFor="result-upload"
              className={`focus-ring cursor-pointer inline-flex items-center justify-center rounded-md border border-signal-teal text-signal-teal px-4 py-2 text-sm font-medium hover:bg-signal-teal/10 transition-colors ${busy ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Upload Result File
            </label>
          </div>
        </div>
      )}

      {user && !isOrganizer && !tournament.bracketGenerated && tournament.status === 'registration_open' && (
        hasRegistered ? (
          <div className="mt-8 mx-auto max-w-sm rounded-xl border border-signal-teal/30 bg-signal-teal/5 p-6 text-center shadow-[0_0_20px_rgba(45,212,191,0.1)] backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-signal-lime to-signal-teal"></div>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-signal-teal/20 text-signal-teal">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="font-display text-lg font-bold text-white tracking-tight">Registration Complete</h2>
            <p className="mt-2 text-sm text-mist-300">You are officially locked in for this tournament. Prepare for battle!</p>
          </div>
        ) : (
          <form onSubmit={handleRegisterClick} className="mt-8 max-w-sm rounded-lg border border-ink-700 bg-ink-900/50 p-5">
            <h2 className="font-display text-sm font-semibold text-mist-100">Register a team</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-3">
                <input required placeholder="Team Name" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
                <input placeholder="Team Tag (optional)" maxLength={6} value={teamForm.tag} onChange={(e) => setTeamForm({ ...teamForm, tag: e.target.value })} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
              </div>

              {teamForm.players.map((player, idx) => (
                <div key={idx} className="space-y-3 pt-3 border-t border-ink-700">
                  <p className="text-xs font-semibold text-mist-400 uppercase tracking-wider">Player {idx + 1} Details</p>
                  <input required placeholder={`Player ${idx + 1} Real Name`} value={player.realName} onChange={(e) => { const newPlayers = [...teamForm.players]; newPlayers[idx].realName = e.target.value; setTeamForm({ ...teamForm, players: newPlayers }); }} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
                  <input required placeholder={`Player ${idx + 1} In-Game Name (IGN)`} value={player.inGameName} onChange={(e) => { const newPlayers = [...teamForm.players]; newPlayers[idx].inGameName = e.target.value; setTeamForm({ ...teamForm, players: newPlayers }); }} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
                  <input required placeholder={`Player ${idx + 1} Game UID`} value={player.gameUid} onChange={(e) => { const newPlayers = [...teamForm.players]; newPlayers[idx].gameUid = e.target.value; setTeamForm({ ...teamForm, players: newPlayers }); }} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
                  <input required placeholder={`Player ${idx + 1} Mobile Number`} value={player.mobileNumber} onChange={(e) => { const newPlayers = [...teamForm.players]; newPlayers[idx].mobileNumber = e.target.value; setTeamForm({ ...teamForm, players: newPlayers }); }} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
                </div>
              ))}

              <div className="space-y-3 pt-3 border-t border-ink-700">
                <p className="text-xs font-semibold text-mist-400 uppercase tracking-wider">Team Socials (Optional)</p>
                <input placeholder="Instagram Username" value={teamForm.instagram} onChange={(e) => setTeamForm({ ...teamForm, instagram: e.target.value })} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
                <input placeholder="Telegram Username" value={teamForm.telegram} onChange={(e) => setTeamForm({ ...teamForm, telegram: e.target.value })} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
              </div>

              <button type="submit" disabled={busy} className="focus-ring w-full rounded-md bg-signal-teal px-4 py-3 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50 transition-colors mt-4">
                {tournament.entryFee > 0 ? `Register & pay ₹${tournament.entryFee}` : 'Register team'}
              </button>
            </div>
          </form>
        )
      )}

      {displayTeams.length > 0 && !tournament.bracketGenerated && (
        <div className="mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              {isOrganizer ? 'Registered Teams' : 'Your Registration'}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Header row (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-between px-6 py-2 text-xs font-bold uppercase tracking-widest text-mist-400">
              <div className="flex-[2]">Team Name</div>
              <div className="flex-1 text-center">Tag</div>
              <div className="flex-[1.5] text-center">Registered By</div>
              <div className="flex-1 text-center">Status</div>
              <div className="flex-1 text-right">Actions</div>
            </div>

            {displayTeams.map((team, idx) => {
              const isTop = idx < 3;
              return (
                <div
                  key={team._id}
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl px-6 py-4 bg-ink-900/80 backdrop-blur-md transition-all hover:bg-ink-800
                    ${isTop
                      ? 'border border-signal-lime shadow-[0_0_15px_rgba(212,255,0,0.15)] bg-gradient-to-r from-signal-lime/5 to-transparent'
                      : 'border border-ink-800 border-l-[3px] border-l-signal-lime shadow-sm'
                    }
                  `}
                >
                  <div className="flex-[2] flex items-center gap-3">
                    <span className="text-xl opacity-80">🛡️</span>
                    <span className="font-bold text-mist-100 text-base">{team.name}</span>
                  </div>
                  <div className="flex-1 text-left md:text-center text-sm font-medium text-mist-400">
                    <span className="md:hidden text-xs uppercase tracking-wider text-mist-400 mr-2">Tag:</span>
                    {team.tag || '-'}
                  </div>
                  <div className="flex-[1.5] text-left md:text-center text-sm font-medium text-mist-200">
                    <span className="md:hidden text-xs uppercase tracking-wider text-mist-400 mr-2">Captain:</span>
                    {team.captain?.username}
                  </div>
                  <div className="flex-1 text-left md:text-center">
                    <span className={`inline-flex items-center rounded bg-ink-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider
                      ${team.paymentStatus === 'paid' || team.paymentStatus === 'waived'
                        ? 'text-signal-lime shadow-[0_0_10px_rgba(212,255,0,0.2)]'
                        : 'text-signal-violet shadow-[0_0_10px_rgba(178,133,240,0.2)]'
                      }`}>
                      {team.paymentStatus === 'paid' ? `✨ PAID` : `⏳ ${team.paymentStatus}`}
                    </span>
                  </div>
                  <div className="flex-1 text-left md:text-right space-x-4 mt-2 md:mt-0 border-t md:border-0 border-ink-800 pt-3 md:pt-0 w-full md:w-auto">
                    <button
                      disabled={busy}
                      onClick={() => setViewTeam(team)}
                      className="text-mist-200 hover:text-white transition-colors text-xs font-bold tracking-wider uppercase disabled:opacity-50"
                    >
                      View
                    </button>
                    {isOrganizer && team.paymentStatus === 'pending' && (
                      <button
                        disabled={busy}
                        onClick={() => handleUpdatePayment(team._id, 'paid')}
                        className="text-signal-teal hover:text-teal-400 transition-colors text-xs font-bold tracking-wider uppercase disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {isOrganizer && (
                      <button
                        disabled={busy}
                        onClick={() => handleRemoveTeam(team._id)}
                        className="text-signal-red hover:text-red-400 transition-colors text-xs font-bold tracking-wider uppercase disabled:opacity-50"
                      >
                        Drop
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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

      {tournament.resultFiles && tournament.resultFiles.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-lg font-semibold text-mist-100">Result Documents</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tournament.resultFiles.map(file => (
              <div key={file._id} className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-900/50 p-4 shadow-sm">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000'}${file.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-signal-teal transition-colors flex-1 min-w-0"
                >
                  <span className="text-xl">📄</span>
                  <span className="truncate text-sm font-medium text-mist-100" title={file.name}>{file.name}</span>
                </a>
                {isOrganizer && (
                  <button
                    onClick={() => handleRemoveFile(file._id)}
                    className="ml-3 text-mist-400 hover:text-signal-red transition-colors text-lg focus-ring rounded-full px-2 py-1"
                    title="Remove file"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          amount={tournament.entryFee}
          tournamentName={tournament.name}
          teamName={teamForm.name}
          busy={busy}
          onClose={() => setShowPayment(false)}
          onConfirm={executeRegistration}
        />
      )}

      {viewTeam && (
        <TeamDetailsModal
          team={viewTeam}
          isOrganizer={isOrganizer}
          onClose={() => setViewTeam(null)}
          onMarkPaid={() => { handleUpdatePayment(viewTeam._id, 'paid'); setViewTeam(null); }}
        />
      )}
    </div>
  );
}

function PaymentModal({ amount, tournamentName, teamName, onClose, onConfirm, busy }) {
  const [upiUtr, setUpiUtr] = useState('');
  const [refundUpiId, setRefundUpiId] = useState('');
  const transactionNote = encodeURIComponent(`${tournamentName} - Team ${teamName}`);
  const upiUrl = `upi://pay?pa=parthchauhan417418@okaxis&pn=parth%20Chauhan&am=${amount}&tn=${transactionNote}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  const handleSubmit = () => {
    if (!upiUtr || !refundUpiId) return alert('Please enter UTR and Refund UPI ID.');
    onConfirm(upiUtr, refundUpiId, null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm overflow-y-auto py-8">
      <div className="w-full max-w-sm rounded-lg border border-ink-600 bg-ink-900 p-8 text-center shadow-2xl my-auto">
        <h3 className="font-display text-2xl font-semibold text-mist-100">Complete Payment</h3>
        <p className="mt-2 text-sm text-mist-400">Scan with Google Pay or any UPI app to pay ₹{amount}</p>

        <div className="my-6 flex flex-col items-center">
          <a href={upiUrl} className="group relative rounded-xl border-4 border-white bg-white p-2 shadow-lg hover:scale-105 transition-transform block cursor-pointer">
            <img src={qrUrl} alt="Google Pay QR Code" className="h-48 w-48 object-contain" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-bold text-sm bg-black/60 px-3 py-1.5 rounded-full">Tap to Pay</span>
            </div>
          </a>
          <p className="mt-3 text-xs font-medium text-signal-teal animate-pulse">
            👆 Click on QR to Pay Directly (Mobile)
          </p>
        </div>

        <div className="space-y-3 mb-6 text-left">
          <input required placeholder="UPI UTR / Transaction ID" value={upiUtr} onChange={(e) => setUpiUtr(e.target.value)} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
          <input required placeholder="Your UPI ID (For Refunds)" value={refundUpiId} onChange={(e) => setRefundUpiId(e.target.value)} className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100" />
        </div>

        <button onClick={handleSubmit} disabled={busy} className="focus-ring w-full rounded-md bg-signal-teal py-3 text-sm font-medium text-ink-950 hover:bg-signal-teal/90 transition-colors shadow-lg shadow-signal-teal/20 disabled:opacity-50">
          Submit Payment Verification
        </button>
        <button onClick={onClose} disabled={busy} className="mt-4 text-sm text-mist-400 hover:text-mist-200 transition-colors">
          Cancel registration
        </button>
      </div>
    </div>
  );
}

function TeamDetailsModal({ team, isOrganizer, onClose, onMarkPaid }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm overflow-y-auto py-8">
      <div className="w-full max-w-md rounded-lg border border-ink-600 bg-ink-900 p-6 text-left shadow-2xl my-auto">
        <h3 className="font-display text-xl font-semibold text-mist-100 border-b border-ink-700 pb-2 mb-4">Registration Details: {team.name}</h3>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-mist-400 uppercase tracking-wider mb-1">Team Socials</p>
            <p className="text-sm text-mist-200">IG: {team.instagram || 'N/A'}</p>
            <p className="text-sm text-mist-200">TG: {team.telegram || 'N/A'}</p>
          </div>
        </div>

        <h4 className="font-display text-sm font-semibold text-mist-100 border-b border-ink-700 pb-2 mb-3">Player Details</h4>
        <div className="space-y-4 mb-6">
          {team.players && team.players.length > 0 ? team.players.map((p, i) => (
            <div key={i} className="bg-ink-950/50 p-3 rounded-md border border-ink-800">
              <p className="text-xs font-bold text-mist-400 mb-2">Player {i + 1}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-mist-200">
                <p><span className="text-mist-400">Name:</span> {p.realName}</p>
                <p><span className="text-mist-400">IGN:</span> {p.inGameName}</p>
                <p><span className="text-mist-400">UID:</span> {p.gameUid}</p>
                <p><span className="text-mist-400">Mobile:</span> {p.mobileNumber}</p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-mist-400 italic">No player details available (Legacy team)</p>
          )}
        </div>
        <h4 className="font-display text-sm font-semibold text-mist-100 border-b border-ink-700 pb-2 mb-3">Payment Verification</h4>
        <div className="space-y-3 text-sm text-mist-200 mb-6">
          <p><span className="text-mist-400 font-medium">UPI UTR:</span> {team.upiUtr || 'N/A'}</p>
          <p><span className="text-mist-400 font-medium">Refund UPI ID:</span> {team.refundUpiId || 'N/A'}</p>
          {team.paymentScreenshot && (
            <div>
              <p className="text-mist-400 font-medium mb-2">Screenshot:</p>
              <img src={`${apiUrl}${team.paymentScreenshot}`} alt="Payment Screenshot" className="rounded-lg border border-ink-600 max-h-64 object-contain" />
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="focus-ring flex-1 rounded-md border border-ink-600 py-2 text-sm text-mist-200 hover:bg-ink-800">Close</button>
          {isOrganizer && team.paymentStatus === 'pending' && (
            <button onClick={onMarkPaid} className="focus-ring flex-1 rounded-md bg-signal-teal py-2 text-sm font-medium text-ink-950 hover:bg-signal-teal/90">Mark as Paid</button>
          )}
        </div>
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

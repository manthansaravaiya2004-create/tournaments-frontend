'use client';

const roundLabel = (roundIndex, totalRounds) => {
  const remaining = totalRounds - roundIndex;
  if (remaining === 0) return 'Grand Final';
  if (remaining === 1) return 'Semifinal';
  if (remaining === 2) return 'Quarterfinal';
  return `Round ${roundIndex + 1}`;
};

export default function BracketView({ matches, canReport, onReportResult }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-ink-600 py-12 text-center text-sm text-mist-400">
        Bracket hasn't been generated yet.
      </div>
    );
  }

  const rounds = {};
  matches.forEach((m) => {
    rounds[m.round] = rounds[m.round] || [];
    rounds[m.round].push(m);
  });
  const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b);
  const totalRounds = roundNumbers.length;

  return (
    <div className="flex gap-8 overflow-x-auto pb-4">
      {roundNumbers.map((roundNum, idx) => (
        <div key={roundNum} className="flex min-w-[240px] flex-col justify-around gap-6">
          <p className="font-mono text-xs uppercase tracking-wide text-mist-400">
            {roundLabel(idx, totalRounds)}
          </p>
          <div className="flex flex-1 flex-col justify-around gap-6">
            {rounds[roundNum]
              .sort((a, b) => a.matchNumber - b.matchNumber)
              .map((match) => (
                <MatchCard key={match._id} match={match} canReport={canReport} onReportResult={onReportResult} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchCard({ match, canReport, onReportResult }) {
  const teamAName = match.teamA?.name || 'TBD';
  const teamBName = match.teamB?.name || 'TBD';
  const isBye = match.status === 'bye';
  const isDone = match.status === 'completed';
  const winnerId = match.winner?._id || match.winner;

  return (
    <div className="rounded-md border border-ink-600 bg-ink-900/70">
      <TeamRow name={teamAName} tag={match.teamA?.tag} score={match.scoreA} isWinner={isDone && String(winnerId) === String(match.teamA?._id)} />
      <div className="border-t border-ink-700" />
      <TeamRow name={teamBName} tag={match.teamB?.tag} score={match.scoreB} isWinner={isDone && String(winnerId) === String(match.teamB?._id)} />

      <div className="border-t border-ink-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-mist-400">
        {isBye ? 'Bye' : isDone ? 'Final' : match.status === 'ready' ? 'Ready' : 'Pending'}
      </div>

      {canReport && match.status === 'ready' && (
        <button
          onClick={() => onReportResult(match)}
          className="focus-ring w-full border-t border-ink-700 py-2 text-xs font-medium text-signal-violet hover:bg-signal-violet/10"
        >
          Report result
        </button>
      )}
    </div>
  );
}

function TeamRow({ name, tag, score, isWinner }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 ${isWinner ? 'bg-signal-teal/10' : ''}`}>
      <span className={`truncate text-sm ${isWinner ? 'font-medium text-signal-teal' : 'text-mist-100'}`}>
        {name}{tag ? ` [${tag}]` : ''}
      </span>
      <span className="font-mono text-sm text-mist-200">{score ?? '-'}</span>
    </div>
  );
}

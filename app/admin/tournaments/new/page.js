'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../lib/api';

const emptyForm = {
  name: '', game: '', description: '', teamSize: 1, maxTeams: 8,
  entryFee: 0, prizePool: 0, registrationOpensAt: '', registrationClosesAt: '', startsAt: '',
};

export default function NewTournamentPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { tournament } = await api.createTournament(form, token);
      router.push(`/tournaments/${tournament._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  if (!user || user.role !== 'superadmin') {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-mist-100">Super Admin access required</h1>
        <p className="mt-2 text-sm text-mist-400">
          Only super admin accounts can create tournaments.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-mist-100">Create a tournament</h1>
      <p className="mt-1 text-sm text-mist-400">Set the format, cap, and schedule. You can generate the bracket once registration closes.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Tournament name">
          <input required value={form.name} onChange={update('name')} className={inputClass} placeholder="Midweek Clash Cup" />
        </Field>
        <Field label="Game">
          <input required value={form.game} onChange={update('game')} className={inputClass} placeholder="Valorant" />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={update('description')} rows={3} className={inputClass} placeholder="Format, rules, prizing details…" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Team size">
            <input type="number" min={1} value={form.teamSize} onChange={update('teamSize')} className={inputClass} />
          </Field>
          <Field label="Max teams">
            <input type="number" min={2} value={form.maxTeams} onChange={update('maxTeams')} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Entry fee">
            <input type="number" min={0} value={form.entryFee} onChange={update('entryFee')} className={inputClass} />
          </Field>
          <Field label="Prize pool">
            <input type="number" min={0} value={form.prizePool} onChange={update('prizePool')} className={inputClass} />
          </Field>
        </div>

        <Field label="Registration opens">
          <input type="datetime-local" required value={form.registrationOpensAt} onChange={update('registrationOpensAt')} className={inputClass} />
        </Field>
        <Field label="Registration closes">
          <input type="datetime-local" required value={form.registrationClosesAt} onChange={update('registrationClosesAt')} className={inputClass} />
        </Field>
        <Field label="Tournament starts">
          <input type="datetime-local" required value={form.startsAt} onChange={update('startsAt')} className={inputClass} />
        </Field>

        {error && <p className="rounded-md border border-signal-red/40 bg-signal-red/10 px-3 py-2 text-sm text-signal-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring w-full rounded-md bg-signal-violet px-4 py-3 text-sm font-bold text-white uppercase tracking-wide hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create tournament'}
        </button>
      </form>
    </div>
  );
}

const inputClass = 'focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-400/60';

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-mist-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

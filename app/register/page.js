'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.username, form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-20">
      <h1 className="font-display text-2xl font-semibold text-mist-100">Create your account</h1>
      <p className="mt-1 text-sm text-mist-400">Register teams and compete, or run your own tournaments.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-400">Username</label>
          <input
            required
            minLength={3}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-mist-100"
            placeholder="ClutchPlayer"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-400">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-mist-100"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-400">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-mist-100"
            placeholder="At least 6 characters"
          />
        </div>

        {error && <p className="rounded-md border border-signal-red/40 bg-signal-red/10 px-3 py-2 text-sm text-signal-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring w-full rounded-md bg-signal-violet px-4 py-2.5 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-mist-400">
        Already have an account? <Link href="/login" className="text-signal-violet hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

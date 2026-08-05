'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginPage() {
  const { login, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      
      if (user.role !== 'superadmin' && user.role !== 'admin') {
        logout(); // immediately log them back out
        throw new Error('Access denied. You do not have administrator privileges.');
      }
      
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-20">
      <div className="mb-8 text-center">
        <span className="inline-block h-3 w-3 rounded-full bg-signal-teal mb-3 shadow-[0_0_15px_rgba(70,225,184,0.6)]"></span>
        <h1 className="font-display text-3xl font-semibold text-mist-100">Admin Portal</h1>
        <p className="mt-2 text-sm text-mist-400">Sign in to the Bracketed control panel.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-400">Admin Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-400/60"
            placeholder="admin@bracketed.app"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-400">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="focus-ring w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-mist-100"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-md border border-signal-red/40 bg-signal-red/10 px-3 py-3 text-sm text-signal-red">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring w-full rounded-md bg-signal-teal px-4 py-2.5 text-sm font-medium text-ink-950 hover:bg-signal-teal/90 disabled:opacity-50 shadow-[0_0_15px_rgba(70,225,184,0.3)] transition-all"
        >
          {submitting ? 'Authenticating…' : 'Access Control Panel'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/login" className="text-xs text-mist-400 hover:text-mist-100 transition-colors">
          &larr; Back to standard login
        </Link>
      </div>
    </div>
  );
}

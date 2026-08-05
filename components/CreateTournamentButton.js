'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function CreateTournamentButton() {
  const { user } = useAuth();
  
  if (user?.role !== 'superadmin') return null;

  return (
    <Link
      href="/tournaments/new"
      className="focus-ring rounded-md border border-ink-600 px-4 py-2 text-sm font-medium text-mist-200 hover:border-signal-violet hover:text-mist-100"
    >
      Create tournament
    </Link>
  );
}

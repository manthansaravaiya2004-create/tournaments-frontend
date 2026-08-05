'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Link from 'next/link';

export default function AdminPage() {
  const { user, token, loading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'superadmin' && token) {
      Promise.all([
        api.adminOverview(token),
        api.adminUsersList(token)
      ]).then(([overviewData, usersData]) => {
        setOverview(overviewData);
        setUsers(usersData);
      }).catch((err) => setError(err.message));
    }
  }, [user, token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.adminUpdateUserRole(userId, newRole, token);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.adminDeleteUser(userId, token);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return null;

  if (!user || user.role !== 'superadmin') {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-mist-100">Super Admin access required</h1>
        <p className="mt-2 text-sm text-mist-400">This page is restricted to super admin accounts.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-mist-100">Super Admin Dashboard</h1>

      {error && <p className="mt-4 rounded-md bg-signal-red/10 p-3 text-sm text-signal-red border border-signal-red/20">{error}</p>}

      {overview && (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-4">
            <Stat label="Tournaments" value={overview.tournamentCount} />
            <Stat label="Teams registered" value={overview.teamCount} />
            <Stat label="Users" value={overview.userCount} />
            <Stat label="Revenue" value={`$${overview.totalRevenue}`} accent />
          </div>

          <h2 className="mt-10 mb-4 font-display text-lg font-semibold text-mist-100">Upcoming & active</h2>
          <div className="divide-y divide-ink-700 rounded-lg border border-ink-700 bg-ink-900/50">
            {overview.upcoming.length === 0 && <p className="p-5 text-sm text-mist-400">Nothing scheduled.</p>}
            {overview.upcoming.map((t) => (
              <Link key={t._id} href={`/tournaments/${t._id}`} className="focus-ring flex items-center justify-between px-5 py-4 hover:bg-ink-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-mist-100">{t.name}</p>
                  <p className="font-mono text-xs text-mist-400">{t.game}</p>
                </div>
                <div className="text-right text-sm text-mist-400">
                  <p>{t.teams?.length || 0}/{t.maxTeams} teams</p>
                  <p className="capitalize text-signal-violet">{t.status.replace('_', ' ')}</p>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="mt-10 mb-4 font-display text-lg font-semibold text-mist-100">User Management</h2>
          <div className="overflow-x-auto rounded-lg border border-ink-700 bg-ink-900/50">
            <table className="min-w-full divide-y divide-ink-700 text-sm">
              <thead className="bg-ink-950/50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-mist-400">Username</th>
                  <th className="px-5 py-3 text-left font-medium text-mist-400">Email</th>
                  <th className="px-5 py-3 text-left font-medium text-mist-400">Role</th>
                  <th className="px-5 py-3 text-right font-medium text-mist-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-ink-800/30 transition-colors">
                    <td className="px-5 py-3 text-mist-100">{u.username}</td>
                    <td className="px-5 py-3 text-mist-400">{u.email}</td>
                    <td className="px-5 py-3">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL}
                        className="bg-ink-950 border border-ink-600 rounded px-2 py-1 text-mist-200 focus:outline-none focus:border-signal-violet disabled:opacity-50"
                      >
                        <option value="player">Player</option>
                        <option value="organizer">Organizer</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u.role === 'superadmin'}
                        className="text-signal-red hover:text-red-400 disabled:opacity-30 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/50 p-5 hover:border-ink-600 transition-colors">
      <p className={`font-mono text-2xl font-semibold ${accent ? 'text-signal-teal' : 'text-mist-100'}`}>{value}</p>
      <p className="mt-1 text-xs text-mist-400">{label}</p>
    </div>
  );
}

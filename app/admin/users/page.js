'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function AdminUsersPage() {
  const { user, token, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'superadmin' && token) {
      api.adminUsersList(token)
        .then(data => setUsers(data))
        .catch(err => setError(err.message));
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
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      await api.adminDeleteUser(userId, token);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">User Management</h1>
          <p className="text-sm text-mist-400">View and manage roles for all registered users.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-mist-400">Total Users</p>
          <p className="font-mono text-2xl text-mist-100">{users.length}</p>
        </div>
      </div>

      {error && <p className="mb-6 rounded-md bg-signal-red/10 p-4 text-sm text-signal-red border border-signal-red/20">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-ink-700 bg-ink-900/60 shadow-xl">
        <table className="min-w-full divide-y divide-ink-700 text-sm">
          <thead className="bg-ink-950/80">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-mist-400 uppercase tracking-wider text-xs">Username</th>
              <th className="px-6 py-4 text-left font-medium text-mist-400 uppercase tracking-wider text-xs">Email</th>
              <th className="px-6 py-4 text-left font-medium text-mist-400 uppercase tracking-wider text-xs">Role</th>
              <th className="px-6 py-4 text-right font-medium text-mist-400 uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/50">
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-mist-400">Loading users...</td>
              </tr>
            )}
            {users.map(u => (
              <tr key={u._id} className="hover:bg-ink-800/40 transition-colors">
                <td className="px-6 py-4 font-medium text-mist-100">{u.username}</td>
                <td className="px-6 py-4 font-mono text-mist-400">{u.email}</td>
                <td className="px-6 py-4">
                  <select 
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={u.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || u.email === user.email}
                    className="bg-ink-950 border border-ink-600 rounded-md px-3 py-1.5 text-mist-200 focus:outline-none focus:border-signal-violet disabled:opacity-50 text-sm font-medium"
                  >
                    <option value="player">Player</option>
                    <option value="organizer">Organizer</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDeleteUser(u._id)}
                    disabled={u.role === 'superadmin'}
                    className="px-3 py-1.5 rounded-md border border-signal-red/50 text-signal-red hover:bg-signal-red/10 disabled:opacity-30 disabled:border-ink-700 transition-colors text-xs font-medium uppercase tracking-wide"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

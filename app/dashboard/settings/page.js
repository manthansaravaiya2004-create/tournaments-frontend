'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useTheme } from '../../../context/ThemeContext';

export default function UserSettingsPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const { activeTheme, changeTheme, themes } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Load notification preference from local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('notificationsEnabled');
      if (stored !== null) {
        setNotifications(stored === 'true');
      }
    }
  }, []);

  const handleToggleNotifications = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    localStorage.setItem('notificationsEnabled', String(newVal));
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setBusy(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete account');
      
      // Clear cookies and logout
      document.cookie = 'token=; Max-Age=0; path=/;';
      window.location.href = '/';
      
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (loading) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">Account Settings</h1>
        <p className="text-sm text-mist-400">Manage your profile and preferences.</p>
      </div>
      
      {error && <p className="mb-6 rounded-md bg-signal-red/10 p-4 text-sm text-signal-red border border-signal-red/20">{error}</p>}

      <div className="space-y-6">
        
        {/* User Details */}
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
          <h2 className="font-display text-xl font-medium text-mist-100 mb-6 border-b border-ink-700/50 pb-2">Profile Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-mist-400 uppercase tracking-wider mb-1">Username</p>
              <p className="text-lg text-mist-100 font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-mist-400 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-lg text-mist-100 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-mist-400 uppercase tracking-wider mb-1">Account Role</p>
              <span className="inline-flex items-center rounded-full bg-signal-teal/10 px-2.5 py-0.5 text-sm font-medium text-signal-teal border border-signal-teal/20 capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
          <h2 className="font-display text-xl font-medium text-mist-100 mb-6 border-b border-ink-700/50 pb-2">App Preferences</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-mist-200">Global Notifications</p>
              <p className="text-xs text-mist-400 mt-1">Receive alerts and popups from tournament organizers.</p>
            </div>
            <button 
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring ${notifications ? 'bg-signal-teal' : 'bg-ink-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Appearance (Themes) */}
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
          <h2 className="font-display text-xl font-medium text-mist-100 mb-6 border-b border-ink-700/50 pb-2">Appearance</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes?.map((t) => {
              const isActive = activeTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className={`group relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    isActive
                      ? 'border-signal-violet bg-ink-800 shadow-[0_0_15px_rgba(178,133,240,0.15)]'
                      : 'border-ink-700 bg-ink-900/50 hover:border-mist-400 hover:bg-ink-800'
                  }`}
                >
                  {/* Color preview swatches */}
                  <div className="flex gap-2">
                    {t.preview.map((hex, i) => (
                      <span key={i} className="h-6 w-6 rounded-full border border-ink-950 shadow-inner" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                  <div className="font-medium text-mist-100">{t.name}</div>
                  
                  {isActive && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-signal-violet shadow-[0_0_8px_var(--color-signal-violet)] animate-pulseGlow" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-signal-red/30 bg-signal-red/5 p-8 shadow-xl">
          <h2 className="font-display text-xl font-medium text-signal-red mb-6 border-b border-signal-red/20 pb-2">Danger Zone</h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-mist-200">Delete Account</p>
              <p className="text-xs text-mist-400 mt-1">Permanently remove your account and all associated data.</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              disabled={busy}
              className="focus-ring rounded-md border border-signal-red bg-transparent px-5 py-2.5 text-sm font-medium text-signal-red hover:bg-signal-red/10 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {busy ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

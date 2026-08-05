'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function AdminNotificationsPage() {
  const { user, token, loading } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, message, type })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send');
      
      setStatus({ type: 'success', text: 'Notification successfully broadcast to all active users!' });
      setTitle('');
      setMessage('');
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">Global Notifications</h1>
        <p className="text-sm text-mist-400">Send an instant alert to all users currently online.</p>
      </div>

      {status && (
        <div className={`mb-6 rounded-md p-4 text-sm border ${
          status.type === 'error' ? 'bg-signal-red/10 text-signal-red border-signal-red/20' : 'bg-signal-teal/10 text-signal-teal border-signal-teal/20'
        }`}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleSend} className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-mist-200">Notification Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-950 px-4 py-3 text-mist-100 placeholder-mist-500 focus-ring"
              placeholder="e.g., Server Maintenance"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mist-200">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-950 px-4 py-3 text-mist-100 placeholder-mist-500 focus-ring"
              placeholder="Type your message here..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mist-200">Alert Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-950 px-4 py-3 text-mist-100 focus-ring"
            >
              <option value="info">Info (Blue)</option>
              <option value="success">Success (Green)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="error">Urgent (Red)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-signal-violet px-5 py-3 font-semibold text-white transition-all hover:bg-signal-violet/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Broadcasting...' : 'Broadcast Notification'}
          </button>
        </div>
      </form>
    </div>
  );
}

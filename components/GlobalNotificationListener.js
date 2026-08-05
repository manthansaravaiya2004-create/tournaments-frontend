'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { useAuth } from '../context/AuthContext';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export default function GlobalNotificationListener() {
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Request permission for Web Notifications if not already granted/denied
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Small delay so it doesn't interrupt immediate page load too aggressively
        setTimeout(() => Notification.requestPermission(), 2000);
      }
    }

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      query: { role: user?.role || 'guest' }
    });

    socket.on('global_notification', (data) => {
      // Check user preference
      const isEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
      if (!isEnabled) return;

      // 1. Show in-app Toast
      setNotification(data);

      // Auto-hide toast after 8 seconds
      setTimeout(() => {
        setNotification(null);
      }, 8000);

      // 2. Show Browser Web Notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.role]);

  if (!notification) return null;

  // In-App Toast UI
  const typeStyles = {
    info: 'border-signal-teal text-signal-teal shadow-signal-teal/20',
    success: 'border-green-500 text-green-500 shadow-green-500/20',
    warning: 'border-signal-amber text-signal-amber shadow-signal-amber/20',
    error: 'border-signal-red text-signal-red shadow-signal-red/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fade-up max-w-sm w-full">
      <div className={`flex items-start gap-4 rounded-xl border border-l-4 bg-ink-900/95 backdrop-blur-xl p-5 shadow-2xl ${typeStyles[notification.type] || typeStyles.info}`}>
        <div className="flex-1">
          <h4 className="font-display text-lg font-bold text-white mb-1 drop-shadow-md">{notification.title}</h4>
          <p className="text-sm text-mist-200 leading-relaxed font-medium mb-3">{notification.message}</p>
          
          {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default' && (
            <button
              onClick={() => Notification.requestPermission()}
              className="mt-2 rounded bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Enable Desktop Alerts
            </button>
          )}
        </div>
        <button 
          onClick={() => setNotification(null)}
          className="text-mist-500 hover:text-white transition-colors p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('tp_token') : null;
    if (stored) {
      setToken(stored);
      api.me(stored).then(({ user }) => setUser(user)).catch(() => {
        window.localStorage.removeItem('tp_token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, token } = await api.login({ email, password });
    window.localStorage.setItem('tp_token', token);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { user, token } = await api.register({ username, email, password });
    window.localStorage.setItem('tp_token', token);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem('tp_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

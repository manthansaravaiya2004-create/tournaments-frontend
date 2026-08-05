'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const themes = [
  { id: 'gamercraft', name: 'Gamercraft Default', preview: ['#0B0E14', '#D4FF00', '#B285F0'] },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', preview: ['#090916', '#E5FF00', '#FF2A85'] },
  { id: 'crimson', name: 'Crimson Forge', preview: ['#120A0A', '#FF9933', '#FF4D4D'] },
  { id: 'ocean', name: 'Ocean Depths', preview: ['#05131A', '#00FFB2', '#00E5FF'] },
  { id: 'midnight', name: 'Midnight Violet', preview: ['#0D0514', '#00E5FF', '#D400FF'] },
];

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState('gamercraft');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'gamercraft';
    setActiveTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  const changeTheme = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('app-theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  // Avoid hydration mismatch by not rendering until mounted if needed, 
  // but for theme we just apply to document so it's fine.
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ activeTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

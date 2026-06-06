import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const appThemes = {
  light: {
    dark: false,
    primary: '#4A90E2',
    background: '#f5f5f5',
    surface: '#fff',
    surfaceMuted: '#f5f5f5',
    text: '#333',
    textSecondary: '#666',
    textMuted: '#999',
    border: '#e0e0e0',
    cardShadow: '#000',
  },
  dark: {
    dark: true,
    primary: '#4A90E2',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceMuted: '#2A2A2A',
    text: '#F4F4F5',
    textSecondary: '#D4D4D8',
    textMuted: '#A1A1AA',
    border: '#3F3F46',
    cardShadow: '#000',
  },
};

export const ThemeContext = createContext({
  theme: 'light',
  colors: appThemes.light,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const colors = appThemes[theme] || appThemes.light;

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('appTheme');
        if (t) setTheme(t);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      await AsyncStorage.setItem('appTheme', next);
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;

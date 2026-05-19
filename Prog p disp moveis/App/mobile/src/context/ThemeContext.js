import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

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
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;

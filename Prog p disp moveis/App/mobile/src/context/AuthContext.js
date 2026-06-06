import { createContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email.trim(), password);
      const { token, user: userData } = response.data;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Login Error:', {
        status: err.response?.status,
        error: err.response?.data?.error,
        message: err.message,
        url: err.config?.url,
      });
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao fazer login';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreToken = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userJson = await AsyncStorage.getItem('user');

      if (token && userJson) {
        try {
          setUser(JSON.parse(userJson));
        } catch (parseError) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Erro ao restaurar token:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        login,
        logout,
        restoreToken,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

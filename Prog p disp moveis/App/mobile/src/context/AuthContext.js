import { createContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, LOGIN_ROUTE, authService } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const fullLoginUrl = `${BASE_URL}${LOGIN_ROUTE}`;

    setLoading(true);
    setError(null);
    try {
      const debugPayload = {
        baseURL: BASE_URL,
        route: LOGIN_ROUTE,
        fullUrl: fullLoginUrl,
        email: trimmedEmail,
        password: trimmedPassword,
      };

      console.log('Login Debug Request:', debugPayload);
      Alert.alert(
        'Login Debug - Request',
        `baseURL: ${BASE_URL}\nroute: ${LOGIN_ROUTE}\nfullUrl: ${fullLoginUrl}\nemail: ${trimmedEmail}\npassword: ${trimmedPassword}`
      );

      const response = await authService.login(trimmedEmail, trimmedPassword);
      const { token, user: userData } = response.data;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (err) {
      const responseData = err.response?.data;
      const debugError = {
        message: err.message,
        status: err.response?.status,
        data: responseData,
        baseURL: BASE_URL,
        route: LOGIN_ROUTE,
        fullUrl: fullLoginUrl,
        email: trimmedEmail,
        password: trimmedPassword,
      };

      console.error('Login Error:', {
        status: err.response?.status,
        error: err.response?.data?.error,
        message: err.message,
        url: err.config?.url,
        baseURL: err.config?.baseURL,
        data: err.response?.data,
      });
      Alert.alert(
        'Login Debug - Response',
        `message: ${debugError.message}\nstatus: ${debugError.status || 'sem status'}\ndata: ${JSON.stringify(responseData || null)}\nfullUrl: ${debugError.fullUrl}\nemail: ${debugError.email}\npassword: ${debugError.password}`
      );

      const errorMsg = responseData?.error || err.message || 'Erro ao fazer login';
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

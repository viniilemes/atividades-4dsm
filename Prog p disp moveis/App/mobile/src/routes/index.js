import { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';

export function Navigation() {
  const { isLoggedIn, loading, restoreToken } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await restoreToken();
      } catch (error) {
        console.error('Erro ao iniciar autenticação:', error);
      }
    };

    initAuth();
  }, []);

  return (
    <NavigationContainer
      theme={{
        dark: colors.dark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

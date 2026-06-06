import 'react-native-gesture-handler';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeContext, ThemeProvider } from './src/context/ThemeContext';
import { Navigation } from './src/routes';

function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor="#4A90E2" />
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { Navigation } from './src/routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <AuthProvider>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

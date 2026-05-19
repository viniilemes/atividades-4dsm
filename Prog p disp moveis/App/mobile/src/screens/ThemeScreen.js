import { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      <Text style={styles.title}>Tema</Text>
      <Text style={styles.current}>Tema atual: {theme}</Text>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>Alternar tema</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  light: { backgroundColor: '#f5f5f5' },
  dark: { backgroundColor: '#222' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  current: { marginBottom: 16 },
  button: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});

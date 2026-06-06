import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState(false);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem('notificationsEnabled');
      setEnabled(value === 'true');
    })();
  }, []);

  const toggle = async (value) => {
    setEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value ? 'true' : 'false');
    Alert.alert('Configuracoes', value ? 'Notificacoes ativadas' : 'Notificacoes desativadas');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Notificacoes</Text>
      <View style={[styles.row, { backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.text }}>Receber notificacoes</Text>
        <Switch value={enabled} onValueChange={toggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
});

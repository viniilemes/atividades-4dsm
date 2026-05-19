import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem('notificationsEnabled');
      setEnabled(v === 'true');
    })();
  }, []);

  const toggle = async (val) => {
    setEnabled(val);
    await AsyncStorage.setItem('notificationsEnabled', val ? 'true' : 'false');
    Alert.alert('Configurações', val ? 'Notificações ativadas' : 'Notificações desativadas');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <View style={styles.row}>
        <Text>Receber notificações</Text>
        <Switch value={enabled} onValueChange={toggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
});

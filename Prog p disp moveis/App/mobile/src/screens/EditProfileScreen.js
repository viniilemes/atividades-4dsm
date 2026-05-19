import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Erro', 'Informe um email válido');
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim();
      const resp = await authService.updateProfile({ name, email: normalizedEmail });
      // update local user and AsyncStorage
      const updated = resp.data;
      if (setUser) setUser((prev) => ({ ...prev, name: updated.name, email: updated.email }));
      await AsyncStorage.setItem('user', JSON.stringify({ ...( (await AsyncStorage.getItem('user')) ? JSON.parse(await AsyncStorage.getItem('user')) : {}), name: updated.name, email: updated.email }));
      Alert.alert('Sucesso', 'Perfil atualizado');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Falha ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

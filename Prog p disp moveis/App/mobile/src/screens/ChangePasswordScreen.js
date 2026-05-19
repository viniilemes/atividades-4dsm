import { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { authService } from '../services/api';

export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'Nova senha e confirmação não conferem');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      Alert.alert('Sucesso', 'Senha alterada');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Falha ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Senha atual</Text>
      <TextInput style={styles.input} secureTextEntry value={oldPassword} onChangeText={setOldPassword} />

      <Text style={styles.label}>Nova senha</Text>
      <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} />

      <Text style={styles.label}>Confirmar nova senha</Text>
      <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.saveButton} onPress={handleChange} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Alterando...' : 'Alterar senha'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  label: { fontSize: 14, color: '#333', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  saveButton: { marginTop: 24, backgroundColor: '#4A90E2', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600' },
});

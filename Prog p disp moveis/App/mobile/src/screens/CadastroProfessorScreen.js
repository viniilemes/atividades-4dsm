import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';
import { authService } from '../services/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CadastroProfessorScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !password) {
      Alert.alert('Erro', 'Nome, email e senha sao obrigatorios');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Erro', 'Informe um email valido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await authService.createUser({
        name: nome,
        email: email.trim(),
        password,
        role: 'professor',
        telefone,
        especialidade,
      });

      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar professor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nome *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="account-tie" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Nome completo"
              placeholderTextColor={colors.textMuted}
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Email *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="email" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="professor@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Senha de acesso *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="lock" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Minimo 6 caracteres"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Telefone</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="phone" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="(11) 99999-9999"
              placeholderTextColor={colors.textMuted}
              value={telefone}
              onChangeText={setTelefone}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Especialidade</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="book-education" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Ex: Banco de Dados"
              placeholderTextColor={colors.textMuted}
              value={especialidade}
              onChangeText={setEspecialidade}
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Cadastrar Professor</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 16, paddingBottom: 40 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  input: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontSize: 14 },
  submitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

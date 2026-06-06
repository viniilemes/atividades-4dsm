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
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { professoresService } from '../services/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfessorDetalhesScreen({ navigation, route }) {
  const { professor } = route.params || {};
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [nome, setNome] = useState(professor?.nome || '');
  const [email, setEmail] = useState(professor?.email || '');
  const [telefone, setTelefone] = useState(professor?.telefone || '');
  const [especialidade, setEspecialidade] = useState(professor?.especialidade || '');
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleSave = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e email sao obrigatorios');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Erro', 'Informe um email valido');
      return;
    }

    try {
      setLoading(true);
      await professoresService.update(professor.id, {
        nome: nome.trim(),
        email: email.trim(),
        telefone,
        especialidade,
      });

      Alert.alert('Sucesso', 'Professor atualizado com sucesso');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha ao atualizar professor');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, icon, value, onChangeText, props = {}) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialCommunityIcons name={icon} size={20} color="#666" />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          editable={isAdmin && !loading}
          placeholderTextColor={colors.textMuted}
          {...props}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-tie" size={48} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>{professor?.nome}</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {isAdmin ? 'Edite os dados cadastrais do professor' : 'Dados do professor'}
            </Text>
          </View>
        </View>
      </View>

      {renderInput('Nome *', 'account-tie', nome, setNome)}
      {renderInput('Email *', 'email', email, setEmail, {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}
      {renderInput('Telefone', 'phone', telefone, setTelefone)}
      {renderInput('Especialidade', 'book-education', especialidade, setEspecialidade)}

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Criado em</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>
          {professor?.created_at || 'Nao informado'}
        </Text>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Atualizado em</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>
          {professor?.updated_at || 'Nao informado'}
        </Text>
      </View>

      {isAdmin && (
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar alteracoes</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1, marginLeft: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
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
  infoCard: { borderRadius: 12, padding: 16, marginTop: 4 },
  infoLabel: { fontSize: 12, marginTop: 8 },
  infoValue: { fontSize: 14, fontWeight: '500', marginTop: 2 },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

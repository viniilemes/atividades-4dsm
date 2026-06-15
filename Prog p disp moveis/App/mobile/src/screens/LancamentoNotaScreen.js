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
import { professorNotasService } from '../services/api';

export default function LancamentoNotaScreen({ navigation, route }) {
  const { aluno, disciplina } = route.params || {};
  const { colors } = useContext(ThemeContext);
  const [nota1, setNota1] = useState(aluno?.nota1 === null || aluno?.nota1 === undefined ? '' : String(aluno.nota1));
  const [nota2, setNota2] = useState(aluno?.nota2 === null || aluno?.nota2 === undefined ? '' : String(aluno.nota2));
  const [loading, setLoading] = useState(false);
  const [boletimResumo, setBoletimResumo] = useState(null);

  const parseNota = (value) => Number(String(value).replace(',', '.'));

  const handleSave = async () => {
    const parsedNota1 = parseNota(nota1);
    const parsedNota2 = parseNota(nota2);

    if (nota1.trim() === '' || nota2.trim() === '') {
      Alert.alert('Erro', 'Preencha as duas notas');
      return;
    }

    if (!Number.isFinite(parsedNota1) || !Number.isFinite(parsedNota2)) {
      Alert.alert('Erro', 'Informe notas validas');
      return;
    }

    if (parsedNota1 < 0 || parsedNota1 > 10 || parsedNota2 < 0 || parsedNota2 > 10) {
      Alert.alert('Erro', 'As notas devem estar entre 0 e 10');
      return;
    }

    try {
      setLoading(true);
      const response = await professorNotasService.saveGrade({
        aluno_id: aluno.id,
        disciplina_id: disciplina.id,
        matricula: aluno.matricula,
        nota1: parsedNota1,
        nota2: parsedNota2,
      });

      if (response.data?.boletim) {
        setBoletimResumo(response.data.boletim);
      }

      Alert.alert('Sucesso', 'Notas salvas e boletim atualizado', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha ao salvar notas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="clipboard-edit" size={44} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>{aluno?.nome}</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {disciplina?.codigo} - {disciplina?.nome}
            </Text>
          </View>
        </View>

        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Matricula: {aluno?.matricula}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Nota 1</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="numeric-1-box" size={20} color="#666" />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={nota1}
            onChangeText={setNota1}
            keyboardType="numeric"
            placeholder="0 a 10"
            placeholderTextColor={colors.textMuted}
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Nota 2</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="numeric-2-box" size={20} color="#666" />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={nota2}
            onChangeText={setNota2}
            keyboardType="numeric"
            placeholder="0 a 10"
            placeholderTextColor={colors.textMuted}
            editable={!loading}
          />
        </View>
      </View>

      {boletimResumo && (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Boletim atualizado</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Media geral: {boletimResumo.mediaGeral?.toFixed?.(2) || boletimResumo.mediaGeral}
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Situacao geral: {boletimResumo.situacaoGeral}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Salvar notas</Text>
          </>
        )}
      </TouchableOpacity>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  infoText: { fontSize: 14, marginTop: 4 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  input: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontSize: 16 },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
    marginBottom: 32,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

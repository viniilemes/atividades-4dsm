import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';
import { disciplinasService, professoresService } from '../services/api';

export default function CadastroDisciplinaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('60');
  const [professores, setProfessores] = useState([]);
  const [professorSelecionado, setProfessorSelecionado] = useState(null);
  const [showProfessoresModal, setShowProfessoresModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfessores, setLoadingProfessores] = useState(true);

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      setLoadingProfessores(true);
      const response = await professoresService.list();
      setProfessores(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      Alert.alert('Aviso', 'Nao foi possivel carregar professores');
    } finally {
      setLoadingProfessores(false);
    }
  };

  const handleCadastro = async () => {
    if (!nome.trim() || !codigo.trim()) {
      Alert.alert('Erro', 'Nome e codigo sao obrigatorios');
      return;
    }

    const carga = Number(cargaHoraria);
    if (!Number.isFinite(carga) || carga <= 0) {
      Alert.alert('Erro', 'Carga horaria deve ser um numero maior que zero');
      return;
    }

    try {
      setLoading(true);
      await disciplinasService.create({
        nome: nome.trim(),
        codigo: codigo.trim(),
        carga_horaria: carga,
        professor_id: professorSelecionado?.id || null,
      });

      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar disciplina');
    } finally {
      setLoading(false);
    }
  };

  const selecionarProfessor = (professor) => {
    setProfessorSelecionado(professor);
    setShowProfessoresModal(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nome *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="book" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Ex: Programacao Mobile"
              placeholderTextColor={colors.textMuted}
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Codigo *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="identifier" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Ex: MOB101"
              placeholderTextColor={colors.textMuted}
              value={codigo}
              onChangeText={(value) => setCodigo(value.toUpperCase())}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Carga horaria *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="60"
              placeholderTextColor={colors.textMuted}
              value={cargaHoraria}
              onChangeText={setCargaHoraria}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Professor responsavel</Text>
          <TouchableOpacity
            style={[styles.dropdownButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowProfessoresModal(true)}
            disabled={loading || loadingProfessores}
          >
            <MaterialCommunityIcons name="teach" size={20} color="#666" />
            <Text style={[styles.dropdownText, { color: professorSelecionado ? colors.text : colors.textMuted }]}>
              {professorSelecionado?.nome || 'Sem professor vinculado'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {professorSelecionado && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setProfessorSelecionado(null)}
            disabled={loading}
          >
            <Text style={styles.clearButtonText}>Remover professor vinculado</Text>
          </TouchableOpacity>
        )}

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
              <Text style={styles.submitButtonText}>Cadastrar Disciplina</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={showProfessoresModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Selecione um professor</Text>
              <TouchableOpacity onPress={() => setShowProfessoresModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {loadingProfessores ? (
              <ActivityIndicator style={styles.modalLoading} color={colors.primary} />
            ) : (
              <FlatList
                data={professores}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    Nenhum professor cadastrado
                  </Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalOption, { borderBottomColor: colors.border }]}
                    onPress={() => selecionarProfessor(item)}
                  >
                    <Text style={[styles.modalOptionText, { color: colors.text }]}>{item.nome}</Text>
                    <Text style={[styles.modalOptionDetail, { color: colors.textMuted }]}>
                      {item.especialidade || item.email}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
  },
  dropdownText: { flex: 1, marginHorizontal: 8, fontSize: 14 },
  clearButton: { alignItems: 'center', marginBottom: 8 },
  clearButtonText: { color: '#F44336', fontWeight: '600' },
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalLoading: { marginVertical: 24 },
  modalOption: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  modalOptionText: { fontSize: 14, fontWeight: '600' },
  modalOptionDetail: { fontSize: 12, marginTop: 2 },
  emptyText: { padding: 16, textAlign: 'center' },
});

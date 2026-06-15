import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';
import { professorNotasService } from '../services/api';

export default function ProfessorDisciplinaAlunosScreen({ navigation, route }) {
  const { disciplina } = route.params || {};
  const { colors } = useContext(ThemeContext);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAlunos = async (showLoading = true) => {
    if (!disciplina?.id) return;
    if (showLoading) setLoading(true);
    try {
      const response = await professorNotasService.listAlunosByDisciplina(disciplina.id);
      setAlunos(Array.isArray(response.data?.alunos) ? response.data.alunos : []);
      setErrorMessage('');
    } catch (error) {
      setAlunos([]);
      setErrorMessage(error.response?.data?.error || 'Falha ao carregar alunos');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAlunos();
    }, [disciplina?.id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAlunos(false);
    setRefreshing(false);
  };

  const getStatusColor = (situation) => {
    if (situation === 'Aprovado') return '#4CAF50';
    if (situation === 'Reprovado') return '#F44336';
    return '#FF9800';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() =>
        navigation.navigate('LancamentoNota', {
          aluno: item,
          disciplina,
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="account-school" size={30} color="#4A90E2" />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.name, { color: colors.text }]}>{item.nome}</Text>
          <Text style={[styles.detail, { color: colors.textMuted }]}>
            Mat: {item.matricula}
          </Text>
        </View>
        <MaterialCommunityIcons name="pencil" size={22} color={colors.primary} />
      </View>

      <View style={[styles.gradeRow, { borderTopColor: colors.border }]}>
        <View style={styles.gradeBox}>
          <Text style={[styles.gradeLabel, { color: colors.textMuted }]}>Nota 1</Text>
          <Text style={[styles.gradeValue, { color: colors.text }]}>
            {item.nota1 ?? '-'}
          </Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={[styles.gradeLabel, { color: colors.textMuted }]}>Nota 2</Text>
          <Text style={[styles.gradeValue, { color: colors.text }]}>
            {item.nota2 ?? '-'}
          </Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={[styles.gradeLabel, { color: colors.textMuted }]}>Média</Text>
          <Text style={[styles.gradeValue, { color: colors.primary }]}>
            {item.media ?? '-'}
          </Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={[styles.gradeLabel, { color: colors.textMuted }]}>Situação</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.situation) }]}>
            {item.situation}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{disciplina?.nome}</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Selecione um aluno para lançar ou alterar notas
        </Text>
      </View>

      {alunos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-off" size={60} color="#ccc" />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {errorMessage || 'Nenhum aluno encontrado para esta disciplina'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={alunos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  listContainer: { paddingHorizontal: 12, paddingVertical: 8 },
  card: { borderRadius: 12, marginHorizontal: 4, marginVertical: 6, padding: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700' },
  detail: { fontSize: 12, marginTop: 2 },
  gradeRow: { flexDirection: 'row', borderTopWidth: 1, marginTop: 12, paddingTop: 10 },
  gradeBox: { flex: 1 },
  gradeLabel: { fontSize: 11, marginBottom: 4 },
  gradeValue: { fontSize: 14, fontWeight: '700' },
  statusText: { fontSize: 12, fontWeight: '700' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 16, marginTop: 12, textAlign: 'center' },
});

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

export default function ProfessorDisciplinasNotasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDisciplinas = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await professorNotasService.listDisciplinas();
      setDisciplinas(Array.isArray(response.data) ? response.data : []);
      setErrorMessage('');
    } catch (error) {
      setDisciplinas([]);
      setErrorMessage(error.response?.data?.error || 'Falha ao carregar disciplinas');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDisciplinas();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDisciplinas(false);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate('ProfessorDisciplinaAlunos', { disciplina: item })}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="book-open-page-variant" size={30} color="#4A90E2" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.title, { color: colors.text }]}>{item.nome}</Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>
          {item.codigo} • {item.carga_horaria}h
        </Text>
        <Text style={[styles.detail, { color: colors.textMuted }]}>
          {item.total_notas_lancadas || 0} notas lançadas
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
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
      {disciplinas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="book-off" size={60} color="#ccc" />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {errorMessage || 'Nenhuma disciplina vinculada ao seu professor'}
          </Text>
          {errorMessage ? (
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchDisciplinas()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={disciplinas}
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
  listContainer: { paddingHorizontal: 12, paddingVertical: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 6,
    padding: 12,
    elevation: 3,
  },
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
  title: { fontSize: 15, fontWeight: '700' },
  detail: { fontSize: 12, marginTop: 2 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 16, marginTop: 12, textAlign: 'center' },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  retryButtonText: { color: '#fff', fontWeight: '600' },
});

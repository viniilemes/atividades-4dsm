import { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { disciplinasService } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function DisciplinasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchDisciplinas();
    }, [])
  );

  const fetchDisciplinas = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const response = await disciplinasService.list();
      setDisciplinas(Array.isArray(response.data) ? response.data : []);
      setErrorMessage('');
    } catch (error) {
      setDisciplinas([]);
      setErrorMessage(error.response?.data?.error || error.message || 'Falha ao carregar disciplinas');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDisciplinas(false);
    setRefreshing(false);
  };

  const filteredDisciplinas = disciplinas.filter((disciplina) =>
    disciplina.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    disciplina.codigo.includes(searchText)
  );

  const renderDisciplinaItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.disciplinaCard, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate('DisciplinaDetalhes', { disciplina: item })}
    >
      <View style={styles.disciplinaCardContent}>
        <View style={styles.disciplinaIconContainer}>
          <MaterialCommunityIcons name="book" size={32} color="#FF6B6B" />
        </View>
        <View style={styles.disciplinaDetails}>
          <Text style={[styles.disciplinaNome, { color: colors.text }]}>{item.nome}</Text>
          <Text style={[styles.disciplinaCodigo, { color: colors.textSecondary }]}>{item.codigo}</Text>
          <Text style={[styles.disciplinaCarga, { color: colors.textMuted }]}>
            {item.carga_horaria}h - {item.professor_id ? 'Com professor' : 'Sem professor'}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.inputContainer, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="magnify" size={20} color="#666" />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Buscar disciplina"
            placeholderTextColor={colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CadastroDisciplina')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {filteredDisciplinas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="book-off" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            {errorMessage ? `Erro ao carregar disciplinas: ${errorMessage}` : 'Nenhuma disciplina encontrada'}
          </Text>
          {errorMessage ? (
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchDisciplinas()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={filteredDisciplinas}
          renderItem={renderDisciplinaItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          onRefresh={onRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disciplinaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disciplinaCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  disciplinaIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disciplinaDetails: {
    flex: 1,
  },
  disciplinaNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  disciplinaCodigo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  disciplinaCarga: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

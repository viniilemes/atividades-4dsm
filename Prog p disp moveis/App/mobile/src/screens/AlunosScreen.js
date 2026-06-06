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
import { alunosService } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function AlunosScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const canCreateAluno = user?.role === 'admin';
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchAlunos();
    }, [])
  );

  const fetchAlunos = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const response = await alunosService.list();
      setAlunos(Array.isArray(response.data) ? response.data : []);
      setErrorMessage('');
    } catch (error) {
      setAlunos([]);
      setErrorMessage(error.response?.data?.error || error.message || 'Falha ao carregar alunos');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlunos(false);
    setRefreshing(false);
  };

  const filteredAlunos = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    aluno.matricula.includes(searchText)
  );

  const renderAlunoItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.alunoCard, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate('AlunoDetalhes', { aluno: item })}
    >
      <View style={styles.alunoCardContent}>
        <View style={styles.alunoIconContainer}>
          <MaterialCommunityIcons name="account" size={32} color="#4A90E2" />
        </View>
        <View style={styles.alunoDetails}>
          <Text style={[styles.alunoNome, { color: colors.text }]}>{item.nome}</Text>
          <Text style={[styles.alunoMatricula, { color: colors.textSecondary }]}>Mat: {item.matricula}</Text>
          <Text style={[styles.alunoEmail, { color: colors.textMuted }]}>{item.email}</Text>
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
      <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.searchContainer}>
          <View style={[styles.inputContainer, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="magnify" size={20} color="#666" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Buscar por nome ou matrícula"
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
        {canCreateAluno && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CadastroAluno')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {filteredAlunos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-off" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            {errorMessage ? `Erro ao carregar alunos: ${errorMessage}` : 'Nenhum aluno encontrado'}
          </Text>
          {errorMessage ? (
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchAlunos()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={filteredAlunos}
          renderItem={renderAlunoItem}
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
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
  },
  inputContainer: {
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  alunoCard: {
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
  alunoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  alunoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoDetails: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  alunoMatricula: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  alunoEmail: {
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

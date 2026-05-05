import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { disciplinasService } from '../services/api';

export default function DisciplinasScreen() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await disciplinasService.list();
      setDisciplinas(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar disciplinas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDisciplinas();
    setRefreshing(false);
  };

  const filteredDisciplinas = disciplinas.filter((disciplina) =>
    disciplina.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    disciplina.codigo.includes(searchText)
  );

  const renderDisciplinaItem = ({ item }) => (
    <TouchableOpacity style={styles.disciplinaCard}>
      <View style={styles.disciplinaCardContent}>
        <View style={styles.disciplinaIconContainer}>
          <MaterialCommunityIcons name="book" size={32} color="#FF6B6B" />
        </View>
        <View style={styles.disciplinaDetails}>
          <Text style={styles.disciplinaNome}>{item.nome}</Text>
          <Text style={styles.disciplinaCodigo}>{item.codigo}</Text>
          <Text style={styles.disciplinaCarga}>
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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Buscar disciplina"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {filteredDisciplinas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="book-off" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  },
});

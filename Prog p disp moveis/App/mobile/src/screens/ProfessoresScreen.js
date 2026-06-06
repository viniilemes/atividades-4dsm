import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { professoresService } from '../services/api';

export default function ProfessoresScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [professores, setProfessores] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isAdmin = user?.role === 'admin';

  useFocusEffect(
    useCallback(() => {
      fetchProfessores();
    }, [])
  );

  const fetchProfessores = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await professoresService.list();
      setProfessores(Array.isArray(response.data) ? response.data : []);
      setErrorMessage('');
    } catch (error) {
      setProfessores([]);
      setErrorMessage(error.response?.data?.error || error.message || 'Falha ao carregar professores');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfessores(false);
    setRefreshing(false);
  };

  const filteredProfessores = professores.filter((professor) =>
    professor.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderProfessorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate('ProfessorDetalhes', { professor: item })}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="teach" size={30} color="#4A90E2" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.name, { color: colors.text }]}>{item.nome}</Text>
        <Text style={[styles.detail, { color: colors.textMuted }]}>{item.email}</Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>
          {item.especialidade || 'Especialidade nao informada'}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.inputContainer, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="magnify" size={20} color="#666" />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Buscar professor"
            placeholderTextColor={colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CadastroProfessor')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {filteredProfessores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-tie-off" size={60} color="#ccc" />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {errorMessage || 'Nenhum professor encontrado'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProfessores}
          renderItem={renderProfessorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  name: { fontSize: 14, fontWeight: '700' },
  detail: { fontSize: 12, marginTop: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, marginTop: 12, textAlign: 'center', paddingHorizontal: 24 },
});

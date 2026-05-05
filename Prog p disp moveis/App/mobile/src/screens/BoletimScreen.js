import { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { boletimService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function BoletimScreen() {
  const [matricula, setMatricula] = useState('');
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleFetchBoletim = async () => {
    if (!matricula.trim()) {
      Alert.alert('Erro', 'Informe uma matrícula');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await boletimService.getByMatricula(matricula);
      setBoletim(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar boletim');
      Alert.alert('Erro', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (situation) => {
    return situation === 'Aprovado' ? '#4CAF50' : '#F44336';
  };

  const getStatusIcon = (situation) => {
    return situation === 'Aprovado' ? 'check-circle' : 'alert-circle';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account-search" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Digite a matrícula"
            placeholderTextColor="#999"
            value={matricula}
            onChangeText={setMatricula}
            editable={!loading}
          />
        </View>
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.buttonDisabled]}
          onPress={handleFetchBoletim}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {boletim && (
        <View style={styles.boletimContainer}>
          <View style={styles.alunoInfoContainer}>
            <MaterialCommunityIcons name="account" size={40} color="#4A90E2" />
            <View style={styles.alunoInfo}>
              <Text style={styles.alunoNome}>{boletim.aluno.nome}</Text>
              <Text style={styles.alunoMatricula}>Mat: {boletim.aluno.matricula}</Text>
            </View>
          </View>

          <View style={styles.mediaGeralContainer}>
            <Text style={styles.mediaGeralLabel}>Média Geral</Text>
            <Text style={styles.mediaGeralValue}>{boletim.mediaGeral.toFixed(2)}</Text>
            <View
              style={[
                styles.situacaoGeralBadge,
                {
                  backgroundColor: getStatusColor(boletim.situacaoGeral) + '20',
                  borderColor: getStatusColor(boletim.situacaoGeral),
                },
              ]}
            >
              <MaterialCommunityIcons
                name={getStatusIcon(boletim.situacaoGeral)}
                size={16}
                color={getStatusColor(boletim.situacaoGeral)}
              />
              <Text
                style={[
                  styles.situacaoGeralText,
                  { color: getStatusColor(boletim.situacaoGeral) },
                ]}
              >
                {boletim.situacaoGeral}
              </Text>
            </View>
          </View>

          <View style={styles.disciplinasContainer}>
            <Text style={styles.disciplinasTitle}>Disciplinas</Text>
            {boletim.disciplinas.map((disciplina, index) => (
              <View key={index} style={styles.disciplinaCard}>
                <View style={styles.disciplinaHeader}>
                  <View style={styles.disciplinaInfo}>
                    <Text style={styles.disciplinaNome}>{disciplina.nome}</Text>
                    <Text style={styles.disciplinaCodigo}>{disciplina.codigo}</Text>
                  </View>
                  <View
                    style={[
                      styles.disciplinaStatusBadge,
                      {
                        backgroundColor: getStatusColor(disciplina.situation) + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.disciplinaStatusText,
                        { color: getStatusColor(disciplina.situation) },
                      ]}
                    >
                      {disciplina.situation}
                    </Text>
                  </View>
                </View>
                <View style={styles.notasContainer}>
                  <View style={styles.notaItem}>
                    <Text style={styles.notaLabel}>Nota 1</Text>
                    <Text style={styles.notaValue}>{disciplina.nota1}</Text>
                  </View>
                  <View style={styles.notaItem}>
                    <Text style={styles.notaLabel}>Nota 2</Text>
                    <Text style={styles.notaValue}>{disciplina.nota2}</Text>
                  </View>
                  <View style={styles.notaItem}>
                    <Text style={styles.notaLabel}>Média</Text>
                    <Text style={[styles.notaValue, styles.mediaValue]}>
                      {disciplina.media.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {!boletim && !error && !loading && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Busque um boletim por matrícula</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    flex: 1,
    color: '#C62828',
    fontSize: 14,
  },
  boletimContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  alunoInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  alunoInfo: {
    marginLeft: 16,
    flex: 1,
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  alunoMatricula: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  mediaGeralContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  mediaGeralLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  mediaGeralValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  situacaoGeralBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  situacaoGeralText: {
    fontSize: 12,
    fontWeight: '600',
  },
  disciplinasContainer: {
    marginTop: 8,
  },
  disciplinasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  disciplinaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disciplinaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  disciplinaInfo: {
    flex: 1,
  },
  disciplinaNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  disciplinaCodigo: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  disciplinaStatusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  disciplinaStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notaItem: {
    alignItems: 'center',
  },
  notaLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  notaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  mediaValue: {
    fontSize: 18,
    color: '#2E7D32',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

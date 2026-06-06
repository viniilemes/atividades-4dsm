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
  Platform,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { boletimService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function BoletimScreen() {
  const [matricula, setMatricula] = useState('');
  const [boletim, setBoletim] = useState(null);
  const [editedGrades, setEditedGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleFetchBoletim = async ({ showAlert = true, showLoading = true } = {}) => {
    if (!matricula.trim()) {
      Alert.alert('Erro', 'Informe uma matrícula');
      return;
    }

    if (showLoading) setLoading(true);
    setError(null);
    try {
      const response = await boletimService.getByMatricula(matricula);
      setBoletim(response.data);
      // initialize edited grades map
      const map = {};
      response.data.disciplinas.forEach((d) => {
        map[d.id] = { nota1: String(d.nota1 ?? ''), nota2: String(d.nota2 ?? '') };
      });
      setEditedGrades(map);
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao buscar boletim';
      setError(message);
      if (showAlert) Alert.alert('Erro', message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!matricula.trim()) return;

    setRefreshing(true);
    await handleFetchBoletim({ showAlert: false, showLoading: false });
    setRefreshing(false);
  };

  const getStatusColor = (situation) => {
    return situation === 'Aprovado' ? '#4CAF50' : '#F44336';
  };

  const getStatusIcon = (situation) => {
    return situation === 'Aprovado' ? 'check-circle' : 'alert-circle';
  };

  const handleDownloadBoletim = () => {
    if (!boletim) return;

    const content = [
      'Boletim Escolar',
      `Aluno: ${boletim.aluno.nome}`,
      `Matricula: ${boletim.aluno.matricula}`,
      `Media geral: ${boletim.mediaGeral.toFixed(2)}`,
      `Situacao geral: ${boletim.situacaoGeral}`,
      '',
      'Disciplinas:',
      ...boletim.disciplinas.map((disciplina) =>
        `${disciplina.codigo} - ${disciplina.nome} | Nota 1: ${disciplina.nota1} | Nota 2: ${disciplina.nota2} | Media: ${disciplina.media.toFixed(2)} | ${disciplina.situation}`
      ),
    ].join('\n');

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boletim-${boletim.aluno.matricula}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    Alert.alert('Boletim', content);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.searchContainer}>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="account-search" size={20} color="#666" />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Digite a matrícula"
            placeholderTextColor={colors.textMuted}
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
          <View style={[styles.alunoInfoContainer, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="account" size={40} color="#4A90E2" />
            <View style={styles.alunoInfo}>
              <Text style={[styles.alunoNome, { color: colors.text }]}>{boletim.aluno.nome}</Text>
              <Text style={[styles.alunoMatricula, { color: colors.textMuted }]}>Mat: {boletim.aluno.matricula}</Text>
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

          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadBoletim}>
            <MaterialCommunityIcons name="download" size={20} color="#fff" />
            <Text style={styles.downloadButtonText}>Baixar boletim</Text>
          </TouchableOpacity>

          <View style={styles.disciplinasContainer}>
            <Text style={[styles.disciplinasTitle, { color: colors.text }]}>Disciplinas</Text>
            {boletim.disciplinas.map((disciplina, index) => (
              <View key={index} style={[styles.disciplinaCard, { backgroundColor: colors.surface }]}>
                <View style={styles.disciplinaHeader}>
                  <View style={styles.disciplinaInfo}>
                    <Text style={[styles.disciplinaNome, { color: colors.text }]}>{disciplina.nome}</Text>
                    <Text style={[styles.disciplinaCodigo, { color: colors.textMuted }]}>{disciplina.codigo}</Text>
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
                    {user?.role === 'professor' ? (
                      <TextInput
                        style={styles.notaInput}
                        value={editedGrades[disciplina.id]?.nota1}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          setEditedGrades((prev) => ({
                            ...prev,
                            [disciplina.id]: { ...(prev[disciplina.id] || {}), nota1: text },
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.notaValue}>{disciplina.nota1}</Text>
                    )}
                  </View>
                  <View style={styles.notaItem}>
                    <Text style={styles.notaLabel}>Nota 2</Text>
                    {user?.role === 'professor' ? (
                      <TextInput
                        style={styles.notaInput}
                        value={editedGrades[disciplina.id]?.nota2}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          setEditedGrades((prev) => ({
                            ...prev,
                            [disciplina.id]: { ...(prev[disciplina.id] || {}), nota2: text },
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.notaValue}>{disciplina.nota2}</Text>
                    )}
                  </View>
                  <View style={styles.notaItem}>
                    <Text style={styles.notaLabel}>Média</Text>
                    <Text style={[styles.notaValue, styles.mediaValue]}>
                      {disciplina.media.toFixed(2)}
                    </Text>
                  </View>
                  {user?.role === 'professor' && (
                    <View style={styles.saveContainer}>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={async () => {
                          try {
                            const notas = editedGrades[disciplina.id] || {};
                            const nota1 = parseFloat(notas.nota1) || 0;
                            const nota2 = parseFloat(notas.nota2) || 0;
                            await boletimService.addGrade({
                              aluno_id: boletim.aluno.id,
                              disciplina_id: disciplina.id,
                              nota1,
                              nota2,
                            });
                            Alert.alert('Sucesso', 'Notas salvas');
                            // refresh boletim
                            handleFetchBoletim();
                          } catch (err) {
                            Alert.alert('Erro', err.response?.data?.error || 'Falha ao salvar notas');
                          }
                        }}
                      >
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
  notaInput: {
    width: 70,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: '#333',
  },
  saveContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
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

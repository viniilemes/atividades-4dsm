import { useContext, useEffect, useState } from 'react';
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
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { boletimService } from '../services/api';

export default function AlunoDetalhesScreen({ route }) {
  const { aluno } = route.params || {};
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const [boletim, setBoletim] = useState(null);
  const [editedGrades, setEditedGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const canEditGrades = user?.role === 'professor';

  useEffect(() => {
    let isMounted = true;

    const loadBoletim = async () => {
      if (!aluno?.matricula) {
        setLoading(false);
        return;
      }

      try {
        const response = await boletimService.getByMatricula(aluno.matricula);
        if (!isMounted) return;

        const map = {};
        response.data.disciplinas.forEach((disciplina) => {
          map[disciplina.id] = {
            nota1: String(disciplina.nota1 ?? ''),
            nota2: String(disciplina.nota2 ?? ''),
          };
        });

        setBoletim(response.data);
        setEditedGrades(map);
      } catch (error) {
        if (isMounted) {
          setBoletim(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBoletim();

    return () => {
      isMounted = false;
    };
  }, [aluno?.matricula]);

  const saveGrade = async (disciplina) => {
    try {
      const grades = editedGrades[disciplina.id] || {};
      await boletimService.addGrade({
        aluno_id: boletim.aluno.id,
        disciplina_id: disciplina.id,
        nota1: parseFloat(grades.nota1) || 0,
        nota2: parseFloat(grades.nota2) || 0,
      });
      Alert.alert('Sucesso', 'Notas atualizadas');
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha ao atualizar notas');
    }
  };

  const infoItems = [
    ['Matricula', aluno?.matricula],
    ['Email', aluno?.email],
    ['Telefone', aluno?.telefone],
    ['Curso', aluno?.curso],
    ['Cidade/UF', aluno?.cidade && aluno?.estado ? `${aluno.cidade}/${aluno.estado}` : null],
    ['Endereco', aluno?.endereco],
    ['Nascimento', aluno?.data_nascimento],
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-school" size={44} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>{aluno?.nome}</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Perfil academico do aluno
            </Text>
          </View>
        </View>

        {infoItems.map(([label, value]) => (
          <View key={label} style={[styles.infoRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{value || 'Nao informado'}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Boletim</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : boletim ? (
          <>
            <View style={styles.summary}>
              <View>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Media geral</Text>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>
                  {boletim.mediaGeral.toFixed(2)}
                </Text>
              </View>
              <View>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Situacao</Text>
                <Text style={[styles.summaryStatus, { color: colors.text }]}>
                  {boletim.situacaoGeral}
                </Text>
              </View>
            </View>

            {boletim.disciplinas.map((disciplina) => (
              <View key={disciplina.id} style={[styles.disciplinaRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.disciplinaNome, { color: colors.text }]}>{disciplina.nome}</Text>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{disciplina.codigo}</Text>

                <View style={styles.gradeRow}>
                  {['nota1', 'nota2'].map((field) => (
                    <View key={field} style={styles.gradeBox}>
                      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                        {field === 'nota1' ? 'Nota 1' : 'Nota 2'}
                      </Text>
                      {canEditGrades ? (
                        <TextInput
                          style={[
                            styles.gradeInput,
                            {
                              backgroundColor: colors.surfaceMuted,
                              borderColor: colors.border,
                              color: colors.text,
                            },
                          ]}
                          keyboardType="numeric"
                          value={editedGrades[disciplina.id]?.[field]}
                          onChangeText={(text) =>
                            setEditedGrades((prev) => ({
                              ...prev,
                              [disciplina.id]: {
                                ...(prev[disciplina.id] || {}),
                                [field]: text,
                              },
                            }))
                          }
                        />
                      ) : (
                        <Text style={[styles.gradeValue, { color: colors.text }]}>
                          {disciplina[field]}
                        </Text>
                      )}
                    </View>
                  ))}
                  <View style={styles.gradeBox}>
                    <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Media</Text>
                    <Text style={[styles.gradeValue, { color: colors.primary }]}>
                      {disciplina.media.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {canEditGrades && (
                  <TouchableOpacity style={styles.saveButton} onPress={() => saveGrade(disciplina)}>
                    <Text style={styles.saveButtonText}>Salvar notas</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Nenhum boletim encontrado para esta matricula.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerText: { flex: 1, marginLeft: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  infoRow: { borderTopWidth: 1, paddingVertical: 10 },
  infoLabel: { fontSize: 12, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryValue: { fontSize: 24, fontWeight: '700' },
  summaryStatus: { fontSize: 16, fontWeight: '700' },
  disciplinaRow: { borderTopWidth: 1, paddingTop: 12, marginTop: 12 },
  disciplinaNome: { fontSize: 15, fontWeight: '700' },
  gradeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  gradeBox: { flex: 1 },
  gradeInput: { borderWidth: 1, borderRadius: 6, padding: 8, textAlign: 'center' },
  gradeValue: { fontSize: 16, fontWeight: '700' },
  saveButton: { backgroundColor: '#388E3C', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  emptyText: { fontSize: 14 },
});

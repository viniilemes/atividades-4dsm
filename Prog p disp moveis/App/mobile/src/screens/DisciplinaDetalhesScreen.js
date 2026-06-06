import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';

export default function DisciplinaDetalhesScreen({ route }) {
  const { disciplina } = route.params || {};
  const { colors } = useContext(ThemeContext);

  const infoItems = [
    ['Codigo', disciplina?.codigo],
    ['Carga horaria', disciplina?.carga_horaria ? `${disciplina.carga_horaria} horas` : null],
    ['Professor vinculado', disciplina?.professor_id ? `ID ${disciplina.professor_id}` : 'Sem professor'],
    ['Criada em', disciplina?.created_at],
    ['Atualizada em', disciplina?.updated_at],
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="book-open-page-variant" size={44} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>{disciplina?.nome}</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Informacoes academicas da disciplina
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Permissoes do professor</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Professores podem consultar alunos, acessar boletins individuais e lancar notas pelo detalhe do aluno.
          O cadastro e edicao da estrutura da disciplina continuam restritos ao perfil administrativo.
        </Text>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  infoRow: { borderTopWidth: 1, paddingVertical: 10 },
  infoLabel: { fontSize: 12, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  description: { fontSize: 14, lineHeight: 20 },
});

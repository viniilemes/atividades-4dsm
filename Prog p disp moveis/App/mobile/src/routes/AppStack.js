import { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

import DashboardScreen from '../screens/DashboardScreen';
import BoletimScreen from '../screens/BoletimScreen';
import AlunosScreen from '../screens/AlunosScreen';
import DisciplinasScreen from '../screens/DisciplinasScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ThemeScreen from '../screens/ThemeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import AlunoDetalhesScreen from '../screens/AlunoDetalhesScreen';
import DisciplinaDetalhesScreen from '../screens/DisciplinaDetalhesScreen';
import CadastroDisciplinaScreen from '../screens/CadastroDisciplinaScreen';
import ProfessoresScreen from '../screens/ProfessoresScreen';
import CadastroProfessorScreen from '../screens/CadastroProfessorScreen';
import ProfessorDetalhesScreen from '../screens/ProfessorDetalhesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const getStackScreenOptions = (colors) => ({
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  contentStyle: { backgroundColor: colors.background },
});

function DashboardStack() {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </Stack.Navigator>
  );
}

function BoletimStack() {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <Stack.Screen
        name="BoletimMain"
        component={BoletimScreen}
        options={{ title: 'Boletim' }}
      />
    </Stack.Navigator>
  );
}

function AlunosStack() {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <Stack.Screen
        name="AlunosMain"
        component={AlunosScreen}
        options={{ title: 'Alunos' }}
      />
      <Stack.Screen
        name="CadastroAluno"
        component={CadastroAlunoScreen}
        options={{ title: 'Novo Aluno' }}
      />
      <Stack.Screen
        name="AlunoDetalhes"
        component={AlunoDetalhesScreen}
        options={{ title: 'Detalhes do Aluno' }}
      />
    </Stack.Navigator>
  );
}

function DisciplinasStack() {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <Stack.Screen
        name="DisciplinasMain"
        component={DisciplinasScreen}
        options={{ title: 'Disciplinas' }}
      />
      <Stack.Screen
        name="DisciplinaDetalhes"
        component={DisciplinaDetalhesScreen}
        options={{ title: 'Detalhes da Disciplina' }}
      />
      <Stack.Screen
        name="CadastroDisciplina"
        component={CadastroDisciplinaScreen}
        options={{ title: 'Nova Disciplina' }}
      />
    </Stack.Navigator>
  );
}

function ProfessoresStack() {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <Stack.Screen
        name="ProfessoresMain"
        component={ProfessoresScreen}
        options={{ title: 'Professores' }}
      />
      <Stack.Screen
        name="CadastroProfessor"
        component={CadastroProfessorScreen}
        options={{ title: 'Novo Professor' }}
      />
      <Stack.Screen
        name="ProfessorDetalhes"
        component={ProfessorDetalhesScreen}
        options={{ title: 'Detalhes do Professor' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Alterar Senha' }}
      />
      <Stack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{ title: 'Tema' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notificações' }}
      />
    </Stack.Navigator>
  );
}

export function AppStack() {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const canManageAcademicData = ['admin', 'professor'].includes(user?.role);
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BoletimTab"
        component={BoletimStack}
        options={{
          tabBarLabel: 'Boletim',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document" size={size} color={color} />
          ),
        }}
      />
      {canManageAcademicData && (
        <Tab.Screen
          name="AlunosTab"
          component={AlunosStack}
          options={{
            tabBarLabel: 'Alunos',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-multiple" size={size} color={color} />
            ),
          }}
        />
      )}
      {canManageAcademicData && (
        <Tab.Screen
          name="DisciplinasTab"
          component={DisciplinasStack}
          options={{
            tabBarLabel: 'Disciplinas',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book" size={size} color={color} />
            ),
          }}
        />
      )}
      {isAdmin && (
        <Tab.Screen
          name="ProfessoresTab"
          component={ProfessoresStack}
          options={{
            tabBarLabel: 'Professores',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="teach" size={size} color={color} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

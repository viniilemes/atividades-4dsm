import { useState, useContext } from 'react';
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { externalApisService } from '../services/externalApis';
import { authService } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

export default function CadastroAlunoScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [curso, setCurso] = useState('');

  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [lastCepSearched, setLastCepSearched] = useState('');

  const handleSearchCEP = async (cepValue = cep) => {
    const cleanCep = cepValue.replace(/\D/g, '');

    if (!cleanCep || cleanCep.length !== 8) {
      Alert.alert('Erro', 'CEP inválido');
      return;
    }

    if (cepLoading || cleanCep === lastCepSearched) {
      return;
    }

    try {
      setCepLoading(true);
      const response = await externalApisService.getAddressByCEP(cleanCep);
      setEndereco(response.logradouro);
      setCidade(response.localidade);
      setEstado(response.uf);
      setCep(cleanCep);
      setLastCepSearched(cleanCep);
    } catch (error) {
      setLastCepSearched('');
      Alert.alert('Erro', error.message);
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (value) => {
    const cleanCep = value.replace(/\D/g, '').slice(0, 8);
    setCep(cleanCep);

    if (cleanCep.length < 8) {
      setLastCepSearched('');
      setEndereco('');
      setCidade('');
      setEstado('');
      return;
    }

    handleSearchCEP(cleanCep);
  };

  const handleCadastro = async () => {
    if (!nome || !matricula || !email || !password) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await authService.createUser({
        name: nome,
        role: 'aluno',
        matricula,
        email,
        password,
        telefone,
        cpf,
        cep,
        endereco,
        cidade,
        estado,
        curso,
      });

      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Novo Aluno</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formContainer}>
        {/* Nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="account" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />
          </View>
        </View>

        {/* Matrícula */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Matrícula *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="card-text" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Ex: MAT001"
              value={matricula}
              onChangeText={setMatricula}
              editable={!loading}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>
        </View>

        {/* Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha de acesso *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Minimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        {/* Telefone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="phone" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-9999"
              value={telefone}
              onChangeText={setTelefone}
              editable={!loading}
            />
          </View>
        </View>

        {/* CPF */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="card-account-details" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="12345678900"
              keyboardType="numeric"
              value={cpf}
              onChangeText={setCpf}
              editable={!loading}
              maxLength={14}
            />
          </View>
        </View>

        {/* CEP com busca ViaCEP */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Digite 8 numeros"
              keyboardType="numeric"
              value={cep}
              onChangeText={handleCepChange}
              editable={!cepLoading}
              maxLength={8}
            />
            <TouchableOpacity
              style={[styles.searchInsideButton, cepLoading && styles.buttonDisabled]}
              onPress={handleSearchCEP}
              disabled={cepLoading}
            >
              {cepLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <MaterialCommunityIcons name="magnify" size={20} color="#4A90E2" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Endereço (auto-preenchido) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Endereço</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="home" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Preenchido pelo CEP"
              value={endereco}
              editable={false}
            />
          </View>
        </View>

        {/* Estado preenchido pelo CEP */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="map" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Preenchido pelo CEP"
              value={estado}
              editable={false}
            />
          </View>
        </View>

        {/* Cidade preenchida pelo CEP */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cidade</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="city" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Preenchida pelo CEP"
              value={cidade}
              editable={false}
            />
          </View>
        </View>

        {/* Curso */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Curso</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="school" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Ex: Tecnologia em Sistemas"
              value={curso}
              onChangeText={setCurso}
              editable={!loading}
            />
          </View>
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity
          style={[styles.cadastroButton, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
              <Text style={styles.cadastroButtonText}>Cadastrar Aluno</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputWrapper: {
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
  searchInsideButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cadastroButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cadastroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

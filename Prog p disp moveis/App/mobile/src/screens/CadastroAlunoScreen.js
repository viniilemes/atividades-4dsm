import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { externalApisService } from '../services/externalApis';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const cidadesCache = new Map();

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
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);

  const [showEstadosModal, setShowEstadosModal] = useState(false);
  const [showCidadesModal, setShowCidadesModal] = useState(false);

  useEffect(() => {
    carregarEstados();
  }, []);

  const carregarEstados = async () => {
    try {
      setLoading(true);
      const response = await externalApisService.getEstados();
      setEstados(response);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar estados');
    } finally {
      setLoading(false);
    }
  };

  const carregarCidades = async (estadoId) => {
    try {
      const cachedCidades = cidadesCache.get(estadoId);
      if (cachedCidades) {
        setCidades(cachedCidades);
        return;
      }

      setLoading(true);
      const response = await externalApisService.getCidadesByEstado(estadoId);
      cidadesCache.set(estadoId, response);
      setCidades(response);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar cidades');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCEP = async () => {
    if (!cep.trim() || cep.length < 8) {
      Alert.alert('Erro', 'CEP inválido');
      return;
    }

    try {
      setCepLoading(true);
      const response = await externalApisService.getAddressByCEP(cep);
      setEndereco(response.logradouro);
      setCidade(response.localidade);
      setEstado(response.uf);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setCepLoading(false);
    }
  };

  const handleSelecionarEstado = (est) => {
    setEstadoSelecionado(est);
    setEstado(est.sigla);
    carregarCidades(est.id);
    setShowEstadosModal(false);
  };

  const handleSelecionarCidade = (cid) => {
    setCidadeSelecionada(cid);
    setCidade(cid.nome);
    setShowCidadesModal(false);
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
          <View style={styles.cepContainer}>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="12345000"
                value={cep}
                onChangeText={setCep}
                editable={!cepLoading}
                maxLength={8}
              />
            </View>
            <TouchableOpacity
              style={[styles.searchButton, cepLoading && styles.buttonDisabled]}
              onPress={handleSearchCEP}
              disabled={cepLoading}
            >
              {cepLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
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
              placeholder="Rua/Avenida"
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>
        </View>

        {/* Estado com dropdown IBGE */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowEstadosModal(true)}
            disabled={loading}
          >
            <MaterialCommunityIcons name="map" size={20} color="#666" />
            <Text style={[styles.dropdownText, !estado && styles.placeholder]}>
              {estado || 'Selecione um estado'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Cidade com dropdown IBGE */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cidade</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCidadesModal(true)}
            disabled={loading || !estado}
          >
            <MaterialCommunityIcons name="city" size={20} color="#666" />
            <Text style={[styles.dropdownText, !cidade && styles.placeholder]}>
              {cidade || 'Selecione uma cidade'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
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

      {/* Modal Estados */}
      <Modal visible={showEstadosModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione um Estado</Text>
              <TouchableOpacity onPress={() => setShowEstadosModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={estados}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleSelecionarEstado(item)}
                >
                  <Text style={styles.modalOptionText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled
            />
          </View>
        </View>
      </Modal>

      {/* Modal Cidades */}
      <Modal visible={showCidadesModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione uma Cidade</Text>
              <TouchableOpacity onPress={() => setShowCidadesModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cidades}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleSelecionarCidade(item)}
                >
                  <Text style={styles.modalOptionText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled
            />
          </View>
        </View>
      </Modal>
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
  cepContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownText: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  placeholder: {
    color: '#999',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#333',
  },
});

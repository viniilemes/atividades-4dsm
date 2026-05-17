import axios from 'axios';

const VIACEP_URL = 'https://viacep.com.br/ws';
const IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

export async function getAddressByCEP(cep) {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    const response = await axios.get(`${VIACEP_URL}/${cleanCep}/json/`);

    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      logradouro: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      estado: response.data.uf,
      sucesso: true,
    };
  } catch (error) {
    throw new Error(error.message || 'Erro ao buscar CEP');
  }
}

export async function getEstados() {
  try {
    const response = await axios.get(`${IBGE_URL}/estados?orderBy=nome`);
    return response.data.map((estado) => ({
      id: estado.id,
      nome: estado.nome,
      sigla: estado.sigla,
    }));
  } catch (error) {
    throw new Error('Erro ao buscar estados');
  }
}

export async function getCidadesByEstado(estadoId) {
  try {
    const response = await axios.get(
      `${IBGE_URL}/estados/${estadoId}/municipios?orderBy=nome`
    );
    return response.data.map((cidade) => ({
      id: cidade.id,
      nome: cidade.nome,
    }));
  } catch (error) {
    throw new Error('Erro ao buscar cidades');
  }
}

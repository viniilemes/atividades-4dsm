import axios from 'axios';

const VIACEP_URL = 'https://viacep.com.br/ws';
const IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

export const externalApisService = {
  // ViaCEP - Buscar endereço por CEP
  getAddressByCEP: async (cep) => {
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
        cep: response.data.cep,
        logradouro: response.data.logradouro,
        complemento: response.data.complemento,
        bairro: response.data.bairro,
        localidade: response.data.localidade,
        uf: response.data.uf,
        ibge: response.data.ibge,
      };
    } catch (error) {
      throw new Error(error.message || 'Erro ao buscar CEP');
    }
  },

  // IBGE - Listar Estados
  getEstados: async () => {
    try {
      const response = await axios.get(`${IBGE_URL}/estados`);
      return response.data.map((estado) => ({
        id: estado.id,
        nome: estado.nome,
        sigla: estado.sigla,
      }));
    } catch (error) {
      throw new Error('Erro ao buscar estados');
    }
  },

  // IBGE - Listar Cidades por Estado
  getCidadesByEstado: async (estadoId) => {
    try {
      const response = await axios.get(
        `${IBGE_URL}/estados/${estadoId}/municipios`
      );
      return response.data.map((cidade) => ({
        id: cidade.id,
        nome: cidade.nome,
      }));
    } catch (error) {
      throw new Error('Erro ao buscar cidades');
    }
  },
};

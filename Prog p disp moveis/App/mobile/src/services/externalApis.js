import { api } from './api';

export const externalApisService = {
  getAddressByCEP: async (cep) => {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        throw new Error('CEP deve ter 8 digitos');
      }

      const response = await api.post('/localizacao/cep', { cep: cleanCep });
      return {
        logradouro: response.data.logradouro,
        bairro: response.data.bairro,
        localidade: response.data.cidade,
        uf: response.data.estado,
      };
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Erro ao buscar CEP');
    }
  },

  getEstados: async () => {
    try {
      const response = await api.get('/localizacao/estados');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao buscar estados');
    }
  },

  getCidadesByEstado: async (estadoId) => {
    try {
      const response = await api.get(`/localizacao/estados/${estadoId}/cidades`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao buscar cidades');
    }
  },
};

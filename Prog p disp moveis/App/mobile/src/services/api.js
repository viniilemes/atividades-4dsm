import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token em todas requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
};

export const alunosService = {
  list: () => api.get('/alunos'),
  getById: (id) => api.get(`/alunos/${id}`),
  getByMatricula: (matricula) => api.get(`/alunos/matricula/${matricula}`),
  create: (data) => api.post('/alunos', data),
  update: (id, data) => api.put(`/alunos/${id}`, data),
  delete: (id) => api.delete(`/alunos/${id}`),
};

export const disciplinasService = {
  list: () => api.get('/disciplinas'),
  getById: (id) => api.get(`/disciplinas/${id}`),
  create: (data) => api.post('/disciplinas', data),
  update: (id, data) => api.put(`/disciplinas/${id}`, data),
  delete: (id) => api.delete(`/disciplinas/${id}`),
};

export const boletimService = {
  getByMatricula: (matricula) => api.get(`/boletim/${matricula}`),
  addGrade: (data) => api.post('/boletim/grades', data),
};

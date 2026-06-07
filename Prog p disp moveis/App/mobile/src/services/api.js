import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;

export const BASE_URL = ENV_API_URL || 'https://app-scholar-backend-sfcs.onrender.com/api';
export const LOGIN_ROUTE = '/auth/login';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Aumentado de 10s para 30s para conexões lentas
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
    api.post(LOGIN_ROUTE, { email: email.trim(), password: password.trim() }),
  register: (name, email, password, role, profile = {}) =>
    api.post('/auth/register', { name, email, password, role, ...profile }),
  createUser: (data) => api.post('/auth/register', data),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
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

export const professoresService = {
  list: () => api.get('/professores'),
  getById: (id) => api.get(`/professores/${id}`),
  create: (data) => api.post('/professores', data),
  update: (id, data) => api.put(`/professores/${id}`, data),
  delete: (id) => api.delete(`/professores/${id}`),
};

export const boletimService = {
  getByMatricula: (matricula) => api.get(`/boletim/${matricula}`),
  addGrade: (data) => api.post('/boletim/grades', data),
};

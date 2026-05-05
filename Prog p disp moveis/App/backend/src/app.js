import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';

import authRoutes from './modules/auth/routes.js';
import alunosRoutes from './modules/alunos/routes.js';
import disciplinasRoutes from './modules/disciplinas/routes.js';
import boletimRoutes from './modules/boletim/routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB connection on startup
app.use(async (req, res, next) => {
  if (!app.locals.dbConnected) {
    app.locals.dbConnected = await testConnection();
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', alunosRoutes);
app.use('/api', disciplinasRoutes);
app.use('/api', boletimRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;

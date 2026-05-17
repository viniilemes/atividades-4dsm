import { Router } from 'express';
import { 
  searchCEP, 
  listEstados, 
  listCidades 
} from './localizationController.js';

const router = Router();

// ViaCEP - Buscar endereço por CEP
router.post('/localizacao/cep', searchCEP);

// IBGE - Listar estados
router.get('/localizacao/estados', listEstados);

// IBGE - Listar cidades por estado
router.get('/localizacao/estados/:estadoId/cidades', listCidades);

export default router;

import { Router } from 'express';
import { 
  listDisciplinas, 
  getDisciplina, 
  createDisciplina,
  updateDisciplina,
  deleteDisciplina
} from './controller.js';
import { verifyToken, isAdmin } from '../../shared/middlewares/auth.js';

const router = Router();

router.get('/disciplinas', verifyToken, listDisciplinas);
router.get('/disciplinas/:id', verifyToken, getDisciplina);
router.post('/disciplinas', verifyToken, isAdmin, createDisciplina);
router.put('/disciplinas/:id', verifyToken, isAdmin, updateDisciplina);
router.delete('/disciplinas/:id', verifyToken, isAdmin, deleteDisciplina);

export default router;

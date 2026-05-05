import { Router } from 'express';
import { 
  listAlunos, 
  getAluno, 
  getAlunoByMatriculaController,
  createAluno,
  updateAluno,
  deleteAluno
} from './controller.js';
import { verifyToken, isAdmin } from '../../shared/middlewares/auth.js';

const router = Router();

router.get('/alunos', verifyToken, listAlunos);
router.get('/alunos/:id', verifyToken, getAluno);
router.get('/alunos/matricula/:matricula', verifyToken, getAlunoByMatriculaController);
router.post('/alunos', verifyToken, isAdmin, createAluno);
router.put('/alunos/:id', verifyToken, isAdmin, updateAluno);
router.delete('/alunos/:id', verifyToken, isAdmin, deleteAluno);

export default router;

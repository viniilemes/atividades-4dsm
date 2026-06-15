import { Router } from 'express';
import {
  getBoletim,
  addGrade,
  listProfessorDisciplinas,
  listProfessorDisciplinaAlunos,
  addProfessorGrade
} from './controller.js';
import { verifyToken, isProfessor } from '../../shared/middlewares/auth.js';

const router = Router();

router.get('/boletim/:matricula', verifyToken, getBoletim);
// Only professors can insert/update grades
router.post('/boletim/grades', verifyToken, isProfessor, addGrade);
router.get('/professor/disciplinas', verifyToken, isProfessor, listProfessorDisciplinas);
router.get('/professor/disciplinas/:disciplinaId/alunos', verifyToken, isProfessor, listProfessorDisciplinaAlunos);
router.post('/professor/notas', verifyToken, isProfessor, addProfessorGrade);

export default router;

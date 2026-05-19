import { Router } from 'express';
import { getBoletim, addGrade } from './controller.js';
import { verifyToken, isProfessor } from '../../shared/middlewares/auth.js';

const router = Router();

router.get('/boletim/:matricula', verifyToken, getBoletim);
// Only professors can insert/update grades
router.post('/boletim/grades', verifyToken, isProfessor, addGrade);

export default router;

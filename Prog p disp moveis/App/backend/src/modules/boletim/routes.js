import { Router } from 'express';
import { getBoletim, addGrade } from './controller.js';
import { verifyToken } from '../../shared/middlewares/auth.js';

const router = Router();

router.get('/boletim/:matricula', verifyToken, getBoletim);
router.post('/boletim/grades', verifyToken, addGrade);

export default router;

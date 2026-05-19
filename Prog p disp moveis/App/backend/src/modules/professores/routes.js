import { Router } from 'express';
import {
	listProfessores,
	getProfessor,
	createProfessorHandler,
	updateProfessorHandler,
	deleteProfessorHandler,
} from './controller.js';
import { verifyToken, isAdmin } from '../../shared/middlewares/auth.js';

const router = Router();

// Public read endpoints
router.get('/professores', verifyToken, listProfessores);
router.get('/professores/:id', verifyToken, getProfessor);

// Admin protected management endpoints
router.post('/professores', verifyToken, isAdmin, createProfessorHandler);
router.put('/professores/:id', verifyToken, isAdmin, updateProfessorHandler);
router.delete('/professores/:id', verifyToken, isAdmin, deleteProfessorHandler);

export default router;

import { Router } from 'express';
import { login, register, updateProfile, changePassword } from './controller.js';
import { verifyToken, isAdmin } from '../../shared/middlewares/auth.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/register', verifyToken, isAdmin, register);
router.put('/auth/profile', verifyToken, updateProfile);
router.post('/auth/change-password', verifyToken, changePassword);

export default router;

import { loginService, registerService } from './service.js';
import { logAction, logError } from '../../shared/utils/logger.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await loginService(email, password);

    logAction('LOGIN_SUCCESS', { email });

    return res.json(result);
  } catch (error) {
    logError('LOGIN_FAILED', error);
    return res.status(401).json({ error: error.message });
  }
}

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    const result = await registerService(email, password, name);

    logAction('REGISTER_SUCCESS', { email, name });

    return res.status(201).json(result);
  } catch (error) {
    logError('REGISTER_FAILED', error);
    return res.status(400).json({ error: error.message });
  }
}

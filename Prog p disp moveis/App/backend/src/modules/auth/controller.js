import { loginService, registerService, updateProfileService, changePasswordService } from './service.js';
import { logAction, logError } from '../../shared/utils/logger.js';
import { validateEmail } from '../../shared/utils/validators.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!validateEmail(email.trim())) {
      return res.status(400).json({ error: 'Email inválido' });
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
    const {
      email,
      password,
      name,
      role = 'aluno',
      matricula,
      telefone,
      cpf,
      data_nascimento,
      cep,
      endereco,
      cidade,
      estado,
      curso,
      especialidade,
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    if (!validateEmail(email.trim())) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!['aluno', 'professor'].includes(role)) {
      return res.status(400).json({ error: 'Tipo de conta invÃ¡lido' });
    }

    const result = await registerService(name, email, password, role, {
      matricula,
      telefone,
      cpf,
      data_nascimento,
      cep,
      endereco,
      cidade,
      estado,
      curso,
      especialidade,
    });

    logAction('REGISTER_SUCCESS', { email, name, role });

    return res.status(201).json(result);
  } catch (error) {
    logError('REGISTER_FAILED', error);
    return res.status(400).json({ error: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const id = req.user?.id;
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    if (!validateEmail(email.trim())) return res.status(400).json({ error: 'Email inválido' });
    const updated = await updateProfileService(id, { name, email });
    return res.json(updated);
  } catch (error) {
    logError('UPDATE_PROFILE_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

export async function changePassword(req, res) {
  try {
    const id = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Senhas são obrigatórias' });
    await changePasswordService(id, oldPassword, newPassword);
    return res.json({ success: true });
  } catch (error) {
    logError('CHANGE_PASSWORD_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

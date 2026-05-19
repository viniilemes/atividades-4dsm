import {
  getAllProfessores,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
} from './service.js';
import { logAction, logError } from '../../shared/utils/logger.js';

export async function listProfessores(req, res) {
  try {
    const professores = await getAllProfessores();
    logAction('LIST_PROFESSORES');
    return res.json(professores);
  } catch (error) {
    logError('LIST_PROFESSORES_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function getProfessor(req, res) {
  try {
    const { id } = req.params;
    const professor = await getProfessorById(id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
    logAction('GET_PROFESSOR', { id });
    return res.json(professor);
  } catch (error) {
    logError('GET_PROFESSOR_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function createProfessorHandler(req, res) {
  try {
    const data = req.body;
    if (!data.nome || !data.email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    const professor = await createProfessor(data);
    logAction('CREATE_PROFESSOR', { id: professor.id, by: req.user?.id });
    return res.status(201).json(professor);
  } catch (error) {
    logError('CREATE_PROFESSOR_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

export async function updateProfessorHandler(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await updateProfessor(id, data);
    if (!updated) return res.status(404).json({ error: 'Professor não encontrado' });
    logAction('UPDATE_PROFESSOR', { id, by: req.user?.id });
    return res.json(updated);
  } catch (error) {
    logError('UPDATE_PROFESSOR_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteProfessorHandler(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteProfessor(id);
    if (!deleted) return res.status(404).json({ error: 'Professor não encontrado' });
    logAction('DELETE_PROFESSOR', { id, by: req.user?.id });
    return res.json({ success: true });
  } catch (error) {
    logError('DELETE_PROFESSOR_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

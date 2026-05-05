import { 
  getAllDisciplinas, 
  getDisciplinaById,
  createDisciplinaService,
  updateDisciplinaService,
  deleteDisciplinaService
} from './service.js';
import { logAction, logError } from '../../shared/utils/logger.js';

export async function listDisciplinas(req, res) {
  try {
    const disciplinas = await getAllDisciplinas();
    logAction('LIST_DISCIPLINAS', { count: disciplinas.length });
    return res.json(disciplinas);
  } catch (error) {
    logError('LIST_DISCIPLINAS_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function getDisciplina(req, res) {
  try {
    const { id } = req.params;
    const disciplina = await getDisciplinaById(id);

    if (!disciplina) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }

    logAction('GET_DISCIPLINA', { disciplinaId: id });
    return res.json(disciplina);
  } catch (error) {
    logError('GET_DISCIPLINA_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function createDisciplina(req, res) {
  try {
    const { nome, codigo, carga_horaria, professor_id } = req.body;

    if (!nome || !codigo) {
      return res.status(400).json({ error: 'Nome e código são obrigatórios' });
    }

    const disciplina = await createDisciplinaService({
      nome,
      codigo,
      carga_horaria,
      professor_id
    });

    logAction('CREATE_DISCIPLINA', { disciplinaId: disciplina.id, codigo });
    return res.status(201).json(disciplina);
  } catch (error) {
    logError('CREATE_DISCIPLINA_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

export async function updateDisciplina(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const disciplina = await updateDisciplinaService(id, data);

    if (!disciplina) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }

    logAction('UPDATE_DISCIPLINA', { disciplinaId: id });
    return res.json(disciplina);
  } catch (error) {
    logError('UPDATE_DISCIPLINA_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteDisciplina(req, res) {
  try {
    const { id } = req.params;

    await deleteDisciplinaService(id);

    logAction('DELETE_DISCIPLINA', { disciplinaId: id });
    return res.json({ message: 'Disciplina deletada com sucesso' });
  } catch (error) {
    logError('DELETE_DISCIPLINA_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

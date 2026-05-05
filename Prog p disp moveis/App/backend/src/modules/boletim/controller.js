import { getBoletimService } from './service.js';
import { logAction, logError } from '../../shared/utils/logger.js';

export async function getBoletim(req, res) {
  try {
    const { matricula } = req.params;

    if (!matricula) {
      return res.status(400).json({ error: 'Matrícula é obrigatória' });
    }

    const boletim = await getBoletimService(matricula);

    if (!boletim) {
      return res.status(404).json({ error: 'Boletim não encontrado' });
    }

    logAction('GET_BOLETIM', { matricula });
    return res.json(boletim);
  } catch (error) {
    logError('GET_BOLETIM_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function addGrade(req, res) {
  try {
    const { aluno_id, disciplina_id, nota1, nota2 } = req.body;

    if (!aluno_id || !disciplina_id || nota1 === undefined || nota2 === undefined) {
      return res.status(400).json({ error: 'Aluno, disciplina e notas são obrigatórios' });
    }

    if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
      return res.status(400).json({ error: 'Notas devem estar entre 0 e 10' });
    }

    const { addGradeService } = await import('./service.js');
    const result = await addGradeService({ aluno_id, disciplina_id, nota1, nota2 });

    logAction('ADD_GRADE', { aluno_id, disciplina_id });
    return res.status(201).json(result);
  } catch (error) {
    logError('ADD_GRADE_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

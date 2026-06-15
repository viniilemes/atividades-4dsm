import {
  getBoletimService,
  getProfessorDisciplinasService,
  getProfessorDisciplinaAlunosService,
  addGradeForProfessorService
} from './service.js';
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

export async function listProfessorDisciplinas(req, res) {
  try {
    const professorEmail = req.user?.email;
    const disciplinas = await getProfessorDisciplinasService(professorEmail);

    logAction('LIST_PROFESSOR_DISCIPLINAS', {
      professorId: req.user?.id,
      count: disciplinas.length
    });
    return res.json(disciplinas);
  } catch (error) {
    logError('LIST_PROFESSOR_DISCIPLINAS_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function listProfessorDisciplinaAlunos(req, res) {
  try {
    const { disciplinaId } = req.params;

    if (!disciplinaId) {
      return res.status(400).json({ error: 'Disciplina é obrigatória' });
    }

    const result = await getProfessorDisciplinaAlunosService(disciplinaId, req.user?.email);

    if (!result) {
      return res.status(404).json({ error: 'Disciplina não encontrada para este professor' });
    }

    logAction('LIST_PROFESSOR_DISCIPLINA_ALUNOS', {
      professorId: req.user?.id,
      disciplinaId,
      count: result.alunos.length
    });
    return res.json(result);
  } catch (error) {
    logError('LIST_PROFESSOR_DISCIPLINA_ALUNOS_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function addProfessorGrade(req, res) {
  try {
    const { aluno_id, disciplina_id, nota1, nota2, matricula } = req.body;

    if (!aluno_id || !disciplina_id || nota1 === undefined || nota2 === undefined) {
      return res.status(400).json({ error: 'Aluno, disciplina e notas são obrigatórios' });
    }

    if (String(nota1).trim() === '' || String(nota2).trim() === '') {
      return res.status(400).json({ error: 'Notas devem ser preenchidas' });
    }

    const parsedNota1 = Number(String(nota1).replace(',', '.'));
    const parsedNota2 = Number(String(nota2).replace(',', '.'));

    if (!Number.isFinite(parsedNota1) || !Number.isFinite(parsedNota2)) {
      return res.status(400).json({ error: 'Notas devem ser números válidos' });
    }

    if (parsedNota1 < 0 || parsedNota1 > 10 || parsedNota2 < 0 || parsedNota2 > 10) {
      return res.status(400).json({ error: 'Notas devem estar entre 0 e 10' });
    }

    const result = await addGradeForProfessorService(
      {
        aluno_id,
        disciplina_id,
        nota1: parsedNota1,
        nota2: parsedNota2
      },
      req.user?.email
    );

    const boletim = matricula ? await getBoletimService(matricula) : null;

    logAction('ADD_PROFESSOR_GRADE', {
      professorId: req.user?.id,
      aluno_id,
      disciplina_id
    });
    return res.status(201).json({ grade: result, boletim });
  } catch (error) {
    logError('ADD_PROFESSOR_GRADE_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

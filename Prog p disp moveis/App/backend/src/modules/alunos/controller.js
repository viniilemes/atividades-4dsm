import { 
  getAllAlunos, 
  getAlunoById, 
  getAlunoByMatricula,
  createAlunoService,
  updateAlunoService,
  deleteAlunoService
} from './service.js';
import { logAction, logError } from '../../shared/utils/logger.js';

export async function listAlunos(req, res) {
  try {
    const alunos = await getAllAlunos();
    logAction('LIST_ALUNOS', { count: alunos.length });
    return res.json(alunos);
  } catch (error) {
    logError('LIST_ALUNOS_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function getAluno(req, res) {
  try {
    const { id } = req.params;
    const aluno = await getAlunoById(id);

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    logAction('GET_ALUNO', { alunoId: id });
    return res.json(aluno);
  } catch (error) {
    logError('GET_ALUNO_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function getAlunoByMatriculaController(req, res) {
  try {
    const { matricula } = req.params;
    const aluno = await getAlunoByMatricula(matricula);

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    logAction('GET_ALUNO_BY_MATRICULA', { matricula });
    return res.json(aluno);
  } catch (error) {
    logError('GET_ALUNO_BY_MATRICULA_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

export async function createAluno(req, res) {
  try {
    const { nome, matricula, email, telefone, cpf, data_nascimento } = req.body;

    if (!nome || !matricula || !email) {
      return res.status(400).json({ error: 'Nome, matrícula e email são obrigatórios' });
    }

    const aluno = await createAlunoService({
      nome,
      matricula,
      email,
      telefone,
      cpf,
      data_nascimento
    });

    logAction('CREATE_ALUNO', { alunoId: aluno.id, matricula });
    return res.status(201).json(aluno);
  } catch (error) {
    logError('CREATE_ALUNO_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

export async function updateAluno(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const aluno = await updateAlunoService(id, data);

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    logAction('UPDATE_ALUNO', { alunoId: id });
    return res.json(aluno);
  } catch (error) {
    logError('UPDATE_ALUNO_FAILED', error, req.user?.id);
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteAluno(req, res) {
  try {
    const { id } = req.params;

    await deleteAlunoService(id);

    logAction('DELETE_ALUNO', { alunoId: id });
    return res.json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    logError('DELETE_ALUNO_FAILED', error, req.user?.id);
    return res.status(500).json({ error: error.message });
  }
}

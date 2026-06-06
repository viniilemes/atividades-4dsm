import { 
  getAllAlunosRepository, 
  getAlunoByIdRepository,
  getAlunoByMatriculaRepository,
  getAlunoByEmailRepository,
  createAlunoRepository,
  updateAlunoRepository,
  deleteAlunoRepository
} from './repository.js';

export async function getAllAlunos() {
  return await getAllAlunosRepository();
}

export async function getAlunoById(id) {
  return await getAlunoByIdRepository(id);
}

export async function getAlunoByMatricula(matricula) {
  return await getAlunoByMatriculaRepository(matricula);
}

export async function createAlunoService(data) {
  // Validar duplicatas
  const existingMatricula = await getAlunoByMatriculaRepository(data.matricula);
  if (existingMatricula) {
    throw new Error('Matrícula já cadastrada');
  }

  const existingEmail = await getAlunoByEmailRepository(data.email);
  if (existingEmail) {
    throw new Error('Email ja cadastrado para outro aluno');
  }

  return await createAlunoRepository(data);
}

export async function updateAlunoService(id, data) {
  return await updateAlunoRepository(id, data);
}

export async function deleteAlunoService(id) {
  return await deleteAlunoRepository(id);
}

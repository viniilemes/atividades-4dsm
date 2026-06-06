import { 
  getAllDisciplinasRepository, 
  getDisciplinaByIdRepository,
  getDisciplinaByCodigoRepository,
  createDisciplinaRepository,
  updateDisciplinaRepository,
  deleteDisciplinaRepository
} from './repository.js';

export async function getAllDisciplinas() {
  return await getAllDisciplinasRepository();
}

export async function getDisciplinaById(id) {
  return await getDisciplinaByIdRepository(id);
}

export async function createDisciplinaService(data) {
  const existingDisciplina = await getDisciplinaByCodigoRepository(data.codigo);
  if (existingDisciplina) {
    throw new Error('Codigo ja cadastrado para outra disciplina');
  }

  return await createDisciplinaRepository(data);
}

export async function updateDisciplinaService(id, data) {
  return await updateDisciplinaRepository(id, data);
}

export async function deleteDisciplinaService(id) {
  return await deleteDisciplinaRepository(id);
}

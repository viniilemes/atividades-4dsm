import {
  getAllProfessoresRepository,
  getProfessorByIdRepository,
  createProfessorRepository,
  updateProfessorRepository,
  deleteProfessorRepository,
} from './repository.js';

export async function getAllProfessores() {
  return await getAllProfessoresRepository();
}

export async function getProfessorById(id) {
  return await getProfessorByIdRepository(id);
}

export async function createProfessor(data) {
  return await createProfessorRepository(data);
}

export async function updateProfessor(id, data) {
  return await updateProfessorRepository(id, data);
}

export async function deleteProfessor(id) {
  return await deleteProfessorRepository(id);
}

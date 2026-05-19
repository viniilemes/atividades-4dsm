// Repository placeholder for professores
import { pool } from '../../config/db.js';

export async function getAllProfessoresRepository() {
  const query = `SELECT id, nome, email, telefone, especialidade, created_at, updated_at FROM professores ORDER BY nome`;
  const result = await pool.query(query);
  return result.rows;
}

export async function getProfessorByIdRepository(id) {
  const query = `SELECT id, nome, email, telefone, especialidade, created_at, updated_at FROM professores WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function createProfessorRepository(data) {
  const query = `
    INSERT INTO professores (nome, email, telefone, especialidade, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id, nome, email, telefone, especialidade, created_at, updated_at
  `;
  const values = [data.nome, data.email, data.telefone || null, data.especialidade || null];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateProfessorRepository(id, data) {
  const query = `
    UPDATE professores SET nome = $1, email = $2, telefone = $3, especialidade = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING id, nome, email, telefone, especialidade, created_at, updated_at
  `;
  const values = [data.nome, data.email, data.telefone || null, data.especialidade || null, id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteProfessorRepository(id) {
  const query = `DELETE FROM professores WHERE id = $1 RETURNING id`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

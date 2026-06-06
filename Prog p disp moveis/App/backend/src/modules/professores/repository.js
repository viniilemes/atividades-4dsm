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

export async function getProfessorByEmailRepository(email) {
  const query = `SELECT id, nome, email, telefone, especialidade, created_at, updated_at FROM professores WHERE LOWER(email) = LOWER(TRIM($1))`;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}

export async function createProfessorRepository(data) {
  const query = `
    INSERT INTO professores (nome, email, telefone, especialidade, created_at, updated_at)
    VALUES ($1, LOWER(TRIM($2)), $3, $4, NOW(), NOW())
    RETURNING id, nome, email, telefone, especialidade, created_at, updated_at
  `;
  const values = [data.nome, data.email, data.telefone || null, data.especialidade || null];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateProfessorRepository(id, data) {
  const allowedFields = ['nome', 'email', 'telefone', 'especialidade'];
  const fields = Object.keys(data).filter((key) => allowedFields.includes(key));

  if (fields.length === 0) {
    return await getProfessorByIdRepository(id);
  }

  const setClause = fields
    .map((field, index) =>
      field === 'email'
        ? `${field} = LOWER(TRIM($${index + 1}))`
        : `${field} = $${index + 1}`
    )
    .join(', ');
  const values = fields.map((field) => data[field]);
  values.push(id);

  const query = `
    UPDATE professores SET ${setClause}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING id, nome, email, telefone, especialidade, created_at, updated_at
  `;
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteProfessorRepository(id) {
  const query = `DELETE FROM professores WHERE id = $1 RETURNING id`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

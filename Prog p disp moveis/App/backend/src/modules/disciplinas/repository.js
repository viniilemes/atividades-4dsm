import { pool } from '../../config/db.js';

export async function getAllDisciplinasRepository() {
  const query = 'SELECT * FROM disciplinas ORDER BY nome ASC';
  const result = await pool.query(query);
  return result.rows;
}

export async function getDisciplinaByIdRepository(id) {
  const query = 'SELECT * FROM disciplinas WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function createDisciplinaRepository(data) {
  const query = `
    INSERT INTO disciplinas (nome, codigo, carga_horaria, professor_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    data.nome,
    data.codigo,
    data.carga_horaria || 60,
    data.professor_id || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateDisciplinaRepository(id, data) {
  const allowedFields = ['nome', 'codigo', 'carga_horaria', 'professor_id'];
  const fields = Object.keys(data).filter(key => allowedFields.includes(key));

  if (fields.length === 0) {
    return await getDisciplinaByIdRepository(id);
  }

  const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
  const values = fields.map(field => data[field]);
  values.push(id);

  const query = `
    UPDATE disciplinas
    SET ${setClause}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteDisciplinaRepository(id) {
  const query = 'DELETE FROM disciplinas WHERE id = $1 RETURNING id';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

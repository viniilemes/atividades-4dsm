import { pool } from '../../config/db.js';

export async function getAllAlunosRepository() {
  const query = 'SELECT * FROM alunos ORDER BY nome ASC';
  const result = await pool.query(query);
  return result.rows;
}

export async function getAlunoByIdRepository(id) {
  const query = 'SELECT * FROM alunos WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function getAlunoByMatriculaRepository(matricula) {
  const query = 'SELECT * FROM alunos WHERE matricula = $1';
  const result = await pool.query(query, [matricula]);
  return result.rows[0];
}

export async function createAlunoRepository(data) {
  const query = `
    INSERT INTO alunos (nome, matricula, email, telefone, cpf, data_nascimento)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    data.nome,
    data.matricula,
    data.email,
    data.telefone || null,
    data.cpf || null,
    data.data_nascimento || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateAlunoRepository(id, data) {
  const allowedFields = ['nome', 'email', 'telefone', 'cpf', 'data_nascimento'];
  const fields = Object.keys(data).filter(key => allowedFields.includes(key));

  if (fields.length === 0) {
    const aluno = await getAlunoByIdRepository(id);
    return aluno;
  }

  const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
  const values = fields.map(field => data[field]);
  values.push(id);

  const query = `
    UPDATE alunos
    SET ${setClause}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteAlunoRepository(id) {
  const query = 'DELETE FROM alunos WHERE id = $1 RETURNING id';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

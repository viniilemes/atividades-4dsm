import { pool } from '../../config/db.js';

export async function getBoletimRepository(matricula) {
  const query = `
    SELECT 
      a.id as aluno_id,
      a.nome as aluno_nome,
      a.matricula,
      d.id as disciplina_id,
      d.nome as disciplina_nome,
      d.codigo as disciplina_codigo,
      g.nota1,
      g.nota2
    FROM alunos a
    LEFT JOIN grades g ON a.id = g.aluno_id
    LEFT JOIN disciplinas d ON g.disciplina_id = d.id
    WHERE a.matricula = $1
    ORDER BY d.nome ASC
  `;

  const result = await pool.query(query, [matricula]);
  return result.rows;
}

export async function addGradeRepository(data) {
  const query = `
    INSERT INTO grades (aluno_id, disciplina_id, nota1, nota2)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (aluno_id, disciplina_id) 
    DO UPDATE SET nota1 = $3, nota2 = $4, updated_at = NOW()
    RETURNING *
  `;

  const values = [data.aluno_id, data.disciplina_id, data.nota1, data.nota2];
  const result = await pool.query(query, values);
  return result.rows[0];
}

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
    INNER JOIN matriculas_disciplinas md ON md.aluno_id = a.id
    INNER JOIN disciplinas d ON d.id = md.disciplina_id
    LEFT JOIN grades g ON g.aluno_id = a.id AND g.disciplina_id = d.id
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

export async function getDisciplinasByProfessorEmailRepository(email) {
  const query = `
    SELECT
      d.id,
      d.nome,
      d.codigo,
      d.carga_horaria,
      d.professor_id,
      p.nome AS professor_nome,
      COUNT(DISTINCT g.id)::INT AS total_notas_lancadas
    FROM disciplinas d
    INNER JOIN professores p ON p.id = d.professor_id
    LEFT JOIN matriculas_disciplinas md ON md.disciplina_id = d.id
    LEFT JOIN grades g ON g.disciplina_id = d.id
    WHERE LOWER(p.email) = LOWER(TRIM($1))
    GROUP BY d.id, p.nome
    ORDER BY d.nome ASC
  `;

  const result = await pool.query(query, [email]);
  return result.rows;
}

export async function getAlunosByDisciplinaForProfessorRepository(disciplinaId, professorEmail) {
  const query = `
    SELECT
      a.id AS aluno_id,
      a.nome AS aluno_nome,
      a.matricula,
      a.email,
      g.id AS grade_id,
      g.nota1,
      g.nota2,
      d.id AS disciplina_id,
      d.nome AS disciplina_nome,
      d.codigo AS disciplina_codigo
    FROM disciplinas d
    INNER JOIN professores p ON p.id = d.professor_id
    LEFT JOIN matriculas_disciplinas md ON md.disciplina_id = d.id
    LEFT JOIN alunos a ON a.id = md.aluno_id
    LEFT JOIN grades g ON g.aluno_id = a.id AND g.disciplina_id = d.id
    WHERE d.id = $1
      AND LOWER(p.email) = LOWER(TRIM($2))
    ORDER BY a.nome ASC
  `;

  const result = await pool.query(query, [disciplinaId, professorEmail]);
  return result.rows;
}

export async function addGradeForProfessorRepository(data, professorEmail) {
  const query = `
    INSERT INTO grades (aluno_id, disciplina_id, nota1, nota2)
    SELECT $1, $2, $3, $4
    WHERE EXISTS (
      SELECT 1
      FROM disciplinas d
      INNER JOIN professores p ON p.id = d.professor_id
      INNER JOIN matriculas_disciplinas md ON md.disciplina_id = d.id
      WHERE d.id = $2
        AND md.aluno_id = $1
        AND LOWER(p.email) = LOWER(TRIM($5))
    )
    ON CONFLICT (aluno_id, disciplina_id)
    DO UPDATE SET nota1 = $3, nota2 = $4, updated_at = NOW()
    RETURNING *
  `;

  const values = [
    data.aluno_id,
    data.disciplina_id,
    data.nota1,
    data.nota2,
    professorEmail
  ];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

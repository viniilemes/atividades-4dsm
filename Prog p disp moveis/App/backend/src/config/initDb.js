import { pool } from './db.js';

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email = LOWER(TRIM(email))),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'aluno' CHECK (role IN ('admin', 'aluno', 'professor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  data_nascimento DATE,
  telefone VARCHAR(20),
  cpf VARCHAR(20),
  cep VARCHAR(20),
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  curso VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  especialidade VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  carga_horaria INT DEFAULT 60,
  professor_id INT REFERENCES professores(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matriculas_disciplinas (
  id SERIAL PRIMARY KEY,
  aluno_id INT NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INT NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(aluno_id, disciplina_id)
);

CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  aluno_id INT NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INT NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1 DECIMAL(3,1) CHECK (nota1 >= 0 AND nota1 <= 10),
  nota2 DECIMAL(3,1) CHECK (nota2 >= 0 AND nota2 <= 10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(aluno_id, disciplina_id)
);

ALTER TABLE alunos ADD COLUMN IF NOT EXISTS cpf VARCHAR(20);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS cep VARCHAR(20);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS endereco VARCHAR(255);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS estado VARCHAR(2);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS curso VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_alunos_matricula ON alunos(matricula);
CREATE INDEX IF NOT EXISTS idx_alunos_email ON alunos(email);
CREATE INDEX IF NOT EXISTS idx_disciplinas_codigo ON disciplinas(codigo);
CREATE INDEX IF NOT EXISTS idx_matriculas_aluno ON matriculas_disciplinas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_disciplina ON matriculas_disciplinas(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_grades_aluno ON grades(aluno_id);
CREATE INDEX IF NOT EXISTS idx_grades_disciplina ON grades(disciplina_id);

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@email.com', '$2b$10$bZx8V.wwvHDDtnD0K4exkOyP0D1w1VcvJAp.9A.cDzRgK.ZTkVZrG', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password, role) VALUES
('Prof. Joao Silva', 'joao@email.com', '$2b$10$bZx8V.wwvHDDtnD0K4exkOyP0D1w1VcvJAp.9A.cDzRgK.ZTkVZrG', 'professor'),
('Prof. Maria Santos', 'maria@email.com', '$2b$10$bZx8V.wwvHDDtnD0K4exkOyP0D1w1VcvJAp.9A.cDzRgK.ZTkVZrG', 'professor')
ON CONFLICT (email) DO NOTHING;

INSERT INTO professores (id, nome, email, especialidade) VALUES
(1, 'Prof. Joao Silva', 'joao@email.com', 'Programacao'),
(2, 'Prof. Maria Santos', 'maria@email.com', 'Banco de Dados')
ON CONFLICT (id) DO NOTHING;

INSERT INTO disciplinas (id, nome, codigo, carga_horaria, professor_id) VALUES
(1, 'Programacao Web', 'PROG101', 60, 1),
(2, 'Banco de Dados', 'DB101', 80, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO alunos (id, nome, matricula, email, data_nascimento) VALUES
(1, 'Joao Pedro', 'MAT001', 'joao@student.com', '2004-05-15'),
(2, 'Maria Silva', 'MAT002', 'maria@student.com', '2003-08-22')
ON CONFLICT (id) DO NOTHING;

INSERT INTO matriculas_disciplinas (aluno_id, disciplina_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2)
ON CONFLICT (aluno_id, disciplina_id) DO NOTHING;

INSERT INTO matriculas_disciplinas (aluno_id, disciplina_id)
SELECT aluno_id, disciplina_id FROM grades
ON CONFLICT (aluno_id, disciplina_id) DO NOTHING;

INSERT INTO grades (aluno_id, disciplina_id, nota1, nota2) VALUES
(1, 1, 8.5, 7.5),
(1, 2, 9.0, 8.5),
(2, 1, 7.0, 7.5),
(2, 2, 8.5, 9.0)
ON CONFLICT (aluno_id, disciplina_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), true);
SELECT setval(pg_get_serial_sequence('alunos', 'id'), COALESCE((SELECT MAX(id) FROM alunos), 1), true);
SELECT setval(pg_get_serial_sequence('professores', 'id'), COALESCE((SELECT MAX(id) FROM professores), 1), true);
SELECT setval(pg_get_serial_sequence('disciplinas', 'id'), COALESCE((SELECT MAX(id) FROM disciplinas), 1), true);
SELECT setval(pg_get_serial_sequence('matriculas_disciplinas', 'id'), COALESCE((SELECT MAX(id) FROM matriculas_disciplinas), 1), true);
SELECT setval(pg_get_serial_sequence('grades', 'id'), COALESCE((SELECT MAX(id) FROM grades), 1), true);
`;

export async function initializeDatabase() {
  await pool.query(schema);
  console.log('Database schema initialized.');
}

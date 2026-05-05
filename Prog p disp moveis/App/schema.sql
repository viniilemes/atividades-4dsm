-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'aluno' CHECK (role IN ('admin', 'aluno', 'professor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alunos table
CREATE TABLE alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  cpf VARCHAR(14),
  data_nascimento DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Professores table
CREATE TABLE professores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  especialidade VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disciplinas table
CREATE TABLE disciplinas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  carga_horaria INT DEFAULT 60,
  professor_id INT REFERENCES professores(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Grades table (notas dos alunos)
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  aluno_id INT NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INT NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1 DECIMAL(3,1) CHECK (nota1 >= 0 AND nota1 <= 10),
  nota2 DECIMAL(3,1) CHECK (nota2 >= 0 AND nota2 <= 10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(aluno_id, disciplina_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_alunos_matricula ON alunos(matricula);
CREATE INDEX idx_alunos_email ON alunos(email);
CREATE INDEX idx_disciplinas_codigo ON disciplinas(codigo);
CREATE INDEX idx_grades_aluno ON grades(aluno_id);
CREATE INDEX idx_grades_disciplina ON grades(disciplina_id);

-- Insert default admin user
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@email.com', '$2b$10$...hashed_password_here...', 'admin');

-- Insert sample professors
INSERT INTO professores (nome, email, especialidade) VALUES
('Prof. João Silva', 'joao@email.com', 'Programação'),
('Prof. Maria Santos', 'maria@email.com', 'Banco de Dados');

-- Insert sample disciplines
INSERT INTO disciplinas (nome, codigo, carga_horaria, professor_id) VALUES
('Programação Web', 'PROG101', 60, 1),
('Banco de Dados', 'DB101', 80, 2);

-- Insert sample students
INSERT INTO alunos (nome, matricula, email, data_nascimento) VALUES
('João Pedro', 'MAT001', 'joao@student.com', '2004-05-15'),
('Maria Silva', 'MAT002', 'maria@student.com', '2003-08-22');

-- Insert sample grades
INSERT INTO grades (aluno_id, disciplina_id, nota1, nota2) VALUES
(1, 1, 8.5, 7.5),
(1, 2, 9.0, 8.5),
(2, 1, 7.0, 7.5),
(2, 2, 8.5, 9.0);

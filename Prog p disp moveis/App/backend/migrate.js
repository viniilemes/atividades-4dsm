import { pool } from './src/config/db.js';

const migrations = [
  `ALTER TABLE alunos ADD COLUMN IF NOT EXISTS cep VARCHAR(20)`,
  `ALTER TABLE alunos ADD COLUMN IF NOT EXISTS endereco VARCHAR(255)`,
  `ALTER TABLE alunos ADD COLUMN IF NOT EXISTS cidade VARCHAR(100)`,
  `ALTER TABLE alunos ADD COLUMN IF NOT EXISTS estado VARCHAR(2)`,
  `ALTER TABLE alunos ADD COLUMN IF NOT EXISTS curso VARCHAR(255)`,
];

async function runMigrations() {
  try {
    for (const migration of migrations) {
      await pool.query(migration);
    }

    console.log('Migracoes aplicadas com sucesso.');
  } catch (error) {
    console.error('Falha ao aplicar migracoes:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runMigrations();

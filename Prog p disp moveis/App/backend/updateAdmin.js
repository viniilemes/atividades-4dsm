import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', 4], (err) => {
  if (err) {
    console.log('Erro:', err);
  } else {
    console.log('Usuario 4 atualizado para admin');
  }
  pool.end();
});

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://postgres:1234@localhost:5432/app_scholar'
});

pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', 4], (err) => {
  if (err) {
    console.log('❌ Erro:', err);
  } else {
    console.log('✅ Usuário 4 atualizado para admin');
  }
  pool.end();
});

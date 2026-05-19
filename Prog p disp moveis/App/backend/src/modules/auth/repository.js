import { pool } from '../../config/db.js';

export async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER(TRIM($1))';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export async function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function createUser(data) {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, LOWER(TRIM($2)), $3, $4)
    RETURNING id, name, email, role, created_at
  `;

  const values = [data.name, data.email, data.password, data.role];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateUserById(id, data) {
  const query = `
    UPDATE users SET name = $1, email = LOWER(TRIM($2)), updated_at = NOW()
    WHERE id = $3
    RETURNING id, name, email, role, created_at, updated_at
  `;
  const values = [data.name, data.email, id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function changeUserPassword(id, hashedPassword) {
  const query = `
    UPDATE users SET password = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id
  `;
  const result = await pool.query(query, [hashedPassword, id]);
  return result.rows[0] || null;
}

import pool from '../config/db.js';

export async function getAllActive() {
  const [rows] = await pool.query('SELECT * FROM Properties WHERE is_active = 1');
  return rows;
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM Properties WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function updateAvailability(id, isActive) {
  await pool.execute('UPDATE Properties SET is_active = ? WHERE id = ?', [isActive, id]);
}

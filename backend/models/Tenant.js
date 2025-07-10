import pool from '../config/db.js';

export async function getAll() {
  const [rows] = await pool.query('SELECT * FROM Tenants');
  return rows;
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM Tenants WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function linkLease(tenantId, leaseId) {
  await pool.execute('UPDATE Tenants SET lease_id = ? WHERE id = ?', [leaseId, tenantId]);
}

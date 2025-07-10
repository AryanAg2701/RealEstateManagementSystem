import pool from '../config/db.js';

export async function getAll() {
  const [rows] = await pool.query(`
    SELECT id, tenant_id, description, status, assigned_staff_id, created_at
      FROM maintenancerequests
     ORDER BY created_at DESC
  `);
  return rows;
}

export async function getById(id) {
  const [rows] = await pool.execute(
    `SELECT * FROM maintenancerequests WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function createRequest({ tenant_id, description }) {
  const [result] = await pool.execute(
    `INSERT INTO maintenancerequests (tenant_id, description, status, created_at)
     VALUES (?, ?, 'pending', NOW())`,
    [tenant_id, description]
  );
  return result.insertId;
}

export async function updateStatus(id, { status, assigned_staff_id }) {
  await pool.execute(
    `UPDATE maintenancerequests
       SET status = ?, assigned_staff_id = ?
     WHERE id = ?`,
    [status, assigned_staff_id, id]
  );
}

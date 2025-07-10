import pool from '../config/db.js';

export async function getAll() {
  const [rows] = await pool.query(`
    SELECT l.*, p.address, t.name AS tenant_name
      FROM Leases l
      JOIN Properties p ON l.property_id = p.id
      JOIN Tenants t   ON l.tenant_id = t.id
  `);
  return rows;
}

export async function terminate(id) {
  await pool.execute(`UPDATE Leases SET status = 'terminated' WHERE id = ?`, [id]);
}

export async function create({ property_id, tenant_id, start_date, end_date, rent_amount }) {
  const [result] = await pool.execute(
    `INSERT INTO Leases (property_id, tenant_id, start_date, end_date, rent_amount, status)
     VALUES (?, ?, ?, ?, ?, 'active')`,
    [property_id, tenant_id, start_date, end_date, rent_amount]
  );
  return result.insertId;
}

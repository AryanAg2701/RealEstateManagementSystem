import pool from '../config/db.js';

export async function getAll(tenantId = null) {
  let sql = `
    SELECT p.id, p.tenant_id, p.lease_id, p.amount, p.payment_date, p.method
      FROM Payments p`;
  const params = [];
  if (tenantId) {
    sql += ` WHERE p.tenant_id = ?`;
    params.push(tenantId);
  }
  sql += ` ORDER BY p.payment_date DESC`;
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function getById(id) {
  const [rows] = await pool.execute(
    `SELECT * FROM Payments WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function createPayment({ tenant_id, lease_id, amount, payment_date, method }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      `INSERT INTO Payments (tenant_id, lease_id, amount, payment_date, method)
       VALUES (?, ?, ?, ?, ?)`,
      [tenant_id, lease_id, amount, payment_date, method]
    );
    await conn.commit();
    return result.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

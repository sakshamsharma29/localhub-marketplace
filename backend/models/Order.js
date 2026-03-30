// backend/models/Order.js
const db = require('../config/db');

const Order = {
  async findAll({ userId, businessId, status, limit = 20, offset = 0 } = {}) {
    let query = `
      SELECT o.*, u.name AS customer_name, u.phone AS customer_phone,
             b.name AS business_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN businesses b ON o.business_id = b.id
      WHERE 1=1`;
    const params = [];

    if (userId)     { query += ' AND o.user_id = ?';     params.push(userId); }
    if (businessId) { query += ' AND o.business_id = ?'; params.push(businessId); }
    if (status)     { query += ' AND o.status = ?';      params.push(status); }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
              b.name AS business_name, b.phone AS business_phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN businesses b ON o.business_id = b.id
       WHERE o.id = ?`,
      [id]
    );
    if (!rows[0]) return null;

    const order = rows[0];
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    order.items = items;
    return order;
  },

  async create({ user_id, business_id, total_amount, delivery_charge, payment_method, delivery_address, notes, items }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO orders (user_id, business_id, total_amount, delivery_charge, payment_method, delivery_address, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, business_id, total_amount, delivery_charge, payment_method, delivery_address, notes]
      );
      const orderId = result.insertId;

      for (const item of items) {
        await conn.query(
          `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.product_name, item.price, item.quantity, item.price * item.quantity]
        );
        // Decrement stock
        await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
      }

      await conn.commit();
      return orderId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async updateStatus(id, status) {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  async updatePaymentStatus(id, paymentStatus) {
    const [result] = await db.query('UPDATE orders SET payment_status = ? WHERE id = ?', [paymentStatus, id]);
    return result.affectedRows > 0;
  },
};

module.exports = Order;

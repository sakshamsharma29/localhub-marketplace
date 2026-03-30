// backend/models/Product.js
const db = require('../config/db');

const Product = {
  async findAll({ businessId, category, search, featured, limit = 20, offset = 0 } = {}) {
    let query = 'SELECT p.*, b.name AS business_name, b.city FROM products p JOIN businesses b ON p.business_id = b.id WHERE p.is_active = TRUE';
    const params = [];

    if (businessId) { query += ' AND p.business_id = ?'; params.push(businessId); }
    if (category)   { query += ' AND p.category = ?';    params.push(category); }
    if (featured)   { query += ' AND p.is_featured = TRUE'; }
    if (search)     { query += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT p.*, b.name AS business_name, b.city, b.phone AS business_phone FROM products p JOIN businesses b ON p.business_id = b.id WHERE p.id = ?',
      [id]
    );
    return rows[0];
  },

  async create({ business_id, name, description, price, sale_price, category, image, images, stock, unit }) {
    const [result] = await db.query(
      `INSERT INTO products (business_id, name, description, price, sale_price, category, image, images, stock, unit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [business_id, name, description, price, sale_price, category, image, JSON.stringify(images || []), stock, unit]
    );
    return result.insertId;
  },

  async update(id, { name, description, price, sale_price, category, image, stock, unit, is_active, is_featured }) {
    const [result] = await db.query(
      `UPDATE products SET name=?, description=?, price=?, sale_price=?, category=?, image=?, stock=?, unit=?, is_active=?, is_featured=? WHERE id=?`,
      [name, description, price, sale_price, category, image, stock, unit, is_active, is_featured, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async decrementStock(id, qty) {
    await db.query('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?', [qty, id, qty]);
  },
};

module.exports = Product;

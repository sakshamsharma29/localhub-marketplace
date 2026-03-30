// backend/models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async findAll() {
    const [rows] = await db.query('SELECT id, name, email, phone, address, role, avatar, created_at FROM users');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, address, role, avatar, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async create({ name, email, password, phone, address, role = 'customer' }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, phone, address, role]
    );
    return result.insertId;
  },

  async update(id, { name, phone, address, avatar }) {
    const [result] = await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, avatar = ? WHERE id = ?',
      [name, phone, address, avatar, id]
    );
    return result.affectedRows > 0;
  },

  async updatePassword(id, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },
};

module.exports = User;

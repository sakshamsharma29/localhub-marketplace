// backend/models/Business.js
const db = require('../config/db');

const Business = {
  async findAll({ city, category, search, limit = 20, offset = 0 } = {}) {
    let query = 'SELECT * FROM businesses WHERE is_active = TRUE';
    const params = [];

    if (city) { query += ' AND city = ?'; params.push(city); }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY rating DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM businesses WHERE id = ?', [id]);
    return rows[0];
  },

  async findByOwner(ownerId) {
    const [rows] = await db.query('SELECT * FROM businesses WHERE owner_id = ?', [ownerId]);
    return rows;
  },

  async create({ owner_id, name, description, category, address, city, state, pincode, phone, email, website }) {
    const [result] = await db.query(
      `INSERT INTO businesses (owner_id, name, description, category, address, city, state, pincode, phone, email, website)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [owner_id, name, description, category, address, city, state, pincode, phone, email, website]
    );
    return result.insertId;
  },

  async update(id, { name, description, category, address, city, state, pincode, phone, email, website, logo, banner }) {
    const [result] = await db.query(
      `UPDATE businesses SET name=?, description=?, category=?, address=?, city=?, state=?,
       pincode=?, phone=?, email=?, website=?, logo=?, banner=? WHERE id=?`,
      [name, description, category, address, city, state, pincode, phone, email, website, logo, banner, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM businesses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async updateRating(id) {
    await db.query(
      `UPDATE businesses b
       SET rating = (SELECT AVG(rating) FROM reviews WHERE business_id = ?),
           total_reviews = (SELECT COUNT(*) FROM reviews WHERE business_id = ?)
       WHERE b.id = ?`,
      [id, id, id]
    );
  },

  async getCategories() {
    const [rows] = await db.query('SELECT DISTINCT category FROM businesses WHERE is_active = TRUE AND category IS NOT NULL');
    return rows.map(r => r.category);
  },
};

module.exports = Business;

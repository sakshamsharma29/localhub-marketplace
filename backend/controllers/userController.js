// backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'localhub_secret_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const signToken = (id, role) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// POST /api/users/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const id = await User.create({ name, email, password, phone, address, role });
    const token = signToken(id, role || 'customer');
    res.status(201).json({ message: 'Registration successful', token, user: { id, name, email, role: role || 'customer' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await User.comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user.id, user.role);
    const { password: _, ...safeUser } = user;
    res.json({ message: 'Login successful', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
    await User.update(req.user.id, { name, phone, address, avatar });
    const updated = await User.findById(req.user.id);
    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/me/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByEmail(req.user.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await User.comparePassword(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

    await User.updatePassword(req.user.id, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users — Admin only
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/users/me
exports.deleteMe = async (req, res) => {
  try {
    await User.delete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
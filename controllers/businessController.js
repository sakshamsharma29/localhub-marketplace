// backend/controllers/businessController.js
const Business = require('../models/Business');

// GET /api/businesses
exports.getAll = async (req, res) => {
  try {
    const { city, category, search, limit, offset } = req.query;
    const businesses = await Business.findAll({ city, category, search, limit, offset });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/businesses/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Business.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/businesses/:id
exports.getOne = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/businesses/my
exports.getMine = async (req, res) => {
  try {
    const businesses = await Business.findByOwner(req.user.id);
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/businesses
exports.create = async (req, res) => {
  try {
    const { name, description, category, address, city, state, pincode, phone, email, website } = req.body;
    if (!name || !address || !city) return res.status(400).json({ error: 'Name, address, and city are required' });

    const id = await Business.create({ owner_id: req.user.id, name, description, category, address, city, state, pincode, phone, email, website });
    const business = await Business.findById(id);
    res.status(201).json({ message: 'Business registered', business });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/businesses/:id
exports.update = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    if (business.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const logo = req.files?.logo ? `/uploads/${req.files.logo[0].filename}` : req.body.logo;
    const banner = req.files?.banner ? `/uploads/${req.files.banner[0].filename}` : req.body.banner;

    await Business.update(req.params.id, { ...req.body, logo, banner });
    const updated = await Business.findById(req.params.id);
    res.json({ message: 'Business updated', business: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/businesses/:id
exports.remove = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    if (business.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    await Business.delete(req.params.id);
    res.json({ message: 'Business deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

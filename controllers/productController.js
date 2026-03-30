// backend/controllers/productController.js
const Product = require('../models/Product');
const Business = require('../models/Business');

// GET /api/products
exports.getAll = async (req, res) => {
  try {
    const { businessId, category, search, featured, limit, offset } = req.query;
    const products = await Product.findAll({ businessId, category, search, featured: featured === 'true', limit, offset });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id
exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products
exports.create = async (req, res) => {
  try {
    const { business_id, name, description, price, sale_price, category, stock, unit } = req.body;
    if (!business_id || !name || !price) return res.status(400).json({ error: 'Business, name, and price are required' });

    // Verify ownership
    const business = await Business.findById(business_id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    if (business.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    const id = await Product.create({ business_id, name, description, price, sale_price, category, image, stock, unit });
    const product = await Product.findById(id);
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/products/:id
exports.update = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const business = await Business.findById(product.business_id);
    if (business.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || product.image;
    await Product.update(req.params.id, { ...req.body, image });
    const updated = await Product.findById(req.params.id);
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/products/:id
exports.remove = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const business = await Business.findById(product.business_id);
    if (business.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/orders
exports.getAll = async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    let filter = { status, limit, offset };

    // Customers see only their own orders; admins see all
    if (req.user.role === 'customer') filter.userId = req.user.id;

    const orders = await Order.findAll(filter);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/business/:businessId
exports.getByBusiness = async (req, res) => {
  try {
    const orders = await Order.findAll({ businessId: req.params.businessId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:id
exports.getOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Only the customer, business owner or admin can view
    if (req.user.role === 'customer' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/orders
exports.create = async (req, res) => {
  try {
    const { business_id, items, delivery_address, payment_method, notes } = req.body;

    if (!business_id || !items?.length || !delivery_address) {
      return res.status(400).json({ error: 'Business, items, and delivery address are required' });
    }

    // Calculate total from DB prices (never trust client-side prices)
    let total = 0;
    const enrichedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) return res.status(404).json({ error: `Product ${item.product_id} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });

      const price = product.sale_price || product.price;
      total += price * item.quantity;
      enrichedItems.push({ product_id: item.product_id, product_name: product.name, price, quantity: item.quantity });
    }

    const delivery_charge = total < 300 ? 30 : 0;
    const orderId = await Order.create({
      user_id: req.user.id,
      business_id,
      total_amount: total + delivery_charge,
      delivery_charge,
      payment_method: payment_method || 'cod',
      delivery_address,
      notes,
      items: enrichedItems,
    });

    const order = await Order.findById(orderId);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/orders/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Customers can only cancel their own orders
    if (req.user.role === 'customer') {
      if (order.user_id !== req.user.id) return res.status(403).json({ error: 'Access denied' });
      if (status !== 'cancelled') return res.status(403).json({ error: 'Customers can only cancel orders' });
    }

    await Order.updateStatus(req.params.id, status);
    res.json({ message: 'Order status updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/users',      require('./routes/users'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LocalHub API running', timestamp: new Date() });
});

// Catch-all: serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LocalHub server running at http://localhost:${PORT}`);
});

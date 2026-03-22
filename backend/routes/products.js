// backend/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('./middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `product_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/',       productController.getAll);
router.get('/:id',    productController.getOne);
router.post('/',      protect, upload.single('image'), productController.create);
router.put('/:id',    protect, upload.single('image'), productController.update);
router.delete('/:id', protect, productController.remove);

module.exports = router;

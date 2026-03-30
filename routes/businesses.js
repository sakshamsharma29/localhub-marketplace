// backend/routes/businesses.js
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { protect } = require('./middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `biz_${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/',            businessController.getAll);
router.get('/categories',  businessController.getCategories);
router.get('/my',          protect, businessController.getMine);
router.get('/:id',         businessController.getOne);
router.post('/',           protect, businessController.create);
router.put('/:id',         protect, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), businessController.update);
router.delete('/:id',      protect, businessController.remove);

module.exports = router;

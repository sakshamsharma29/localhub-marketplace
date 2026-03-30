// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('./middleware');

router.get('/',                        protect, orderController.getAll);
router.get('/business/:businessId',    protect, orderController.getByBusiness);
router.get('/:id',                     protect, orderController.getOne);
router.post('/',                       protect, orderController.create);
router.patch('/:id/status',            protect, orderController.updateStatus);

module.exports = router;

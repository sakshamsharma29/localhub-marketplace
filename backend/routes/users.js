// backend/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('./middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `avatar_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.post('/register', userController.register);
router.post('/login',    userController.login);

router.get('/me',            protect, userController.getMe);
router.put('/me',            protect, upload.single('avatar'), userController.updateMe);
router.put('/me/password',   protect, userController.changePassword);

router.delete('/me',         protect, userController.deleteMe);
router.get('/',              protect, userController.getAllUsers); // admin

module.exports = router;
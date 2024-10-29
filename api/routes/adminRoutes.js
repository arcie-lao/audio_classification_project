const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/api-usage', authMiddleware, adminController.getAllUsersUsage);

module.exports = router;

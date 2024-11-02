const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/apiMiddleware');
const sessionMiddleware = require('../middleware/sessionMiddleware');

// router.get('/api-usage', authMiddleware, adminController.getAllUsersUsage);
// Route to get API usage for a specific user
router.get('/usage', sessionMiddleware, adminController.getUsage);

// Route to increment API usage count for a specific user
router.post('/increment-usage', sessionMiddleware, adminController.incrementUsage);

module.exports = router;

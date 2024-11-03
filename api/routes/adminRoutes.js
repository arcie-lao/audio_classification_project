const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

// router.get('/api-usage', authMiddleware, adminController.getAllUsersUsage);
// Route to get API usage for a specific user
router.get('/usage', sessionMiddleware, adminController.getUsage);

router.get('/users', sessionMiddleware, adminController.getUsers);


module.exports = router;

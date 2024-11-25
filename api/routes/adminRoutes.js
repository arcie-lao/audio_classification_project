const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const sessionMiddleware = require('../middleware/sessionMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/usage', sessionMiddleware, adminController.getUsage);

router.get('/users', adminMiddleware, adminController.getUsers);

router.get('/apiUsageStats', adminMiddleware, adminController.getApiUsageStats);

router.delete('/deleteUserByEmail', adminMiddleware, adminController.deleteUserByEmail);

module.exports = router;

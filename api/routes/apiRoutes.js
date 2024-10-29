const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

router.get('/protected-api', authMiddleware, rateLimiter, apiController.trackUsage);

module.exports = router;

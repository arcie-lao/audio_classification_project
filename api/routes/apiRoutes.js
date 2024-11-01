const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/test', authMiddleware.authenticateApiToken, apiController.testCallback);

module.exports = router;

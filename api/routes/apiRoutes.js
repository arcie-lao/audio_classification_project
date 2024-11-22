const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const apiMiddleware = require('../middleware/apiMiddleware');

router.get('/test', apiMiddleware, apiController.testCallback);

router.post('/analyze', apiMiddleware, apiController.analyzeAudio);

router.post('/analyzeSequential', apiMiddleware, apiController.analyzeMultipleAudioSequential);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.put('/changePassword', sessionMiddleware, authController.changePassword);

router.get('/session', sessionMiddleware, authController.getSession);

module.exports = router;

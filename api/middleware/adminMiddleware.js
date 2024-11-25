const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');
const messages = require('../config/middlewaresMessages/adminMessages.json');

const adminMiddleware = async (req, res, next) => { 
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: messages.errors.sessionTokenMissing });
    }

    try {
        const verified = jwtHelper.verifyToken(token);
        const user = await User.getUserByEmail(verified.email);

        if (user.role !== 'admin') {
            return res.status(403).json({ error: messages.errors.unauthorizedAccess });
        }

        req.user = verified;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: messages.errors.invalidSessionToken });
    }
};

module.exports = adminMiddleware;

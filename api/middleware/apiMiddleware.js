const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');

// Middleware to authenticate API token
const apiMiddleware = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'API token required' });
    }
    
    try {
        const decoded = jwtHelper.verifyToken(token);
        const user = await User.getUserByEmail(decoded.email);

        // Check if the token matches the one stored in the database
        if (!user || user.api_token !== token) {
            return res.status(403).json({ error: 'Invalid API token' });
        }

        req.user = user; // Attach user data to request
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired API token' });
    }
};

module.exports = apiMiddleware;

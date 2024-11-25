const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');
const ApiUsage = require('../models/apiUsageModel');
const messages = require('../config/middlewaresMessages/apiMessages.json');

// Middleware to authenticate API token
const apiMiddleware = async (req, res, next) => {
    // Try to get token from Authorization header or cookies
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Check if no token in headers, then try cookies
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ error: messages.errors.tokenRequired });
    }

    try {
        // Verify the token
        const decoded = jwtHelper.verifyToken(token);
        const user = await User.getUserByEmail(decoded.email);

        // Check if the token matches the one stored in the database
        if (!user) {
            return res.status(403).json({ error: messages.errors.invalidToken });
        }

        ApiUsage.incrementUsage(user.id);

        // Check API usage for non-admin users
        if (user.api_usage > 20 && user.role === 'user') {
            req.apiWarning = messages.warnings.apiLimitExceeded;
        }

        req.user = user; // Attach user data to request
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(403).json({ error: messages.errors.tokenExpired });
    }
};

module.exports = apiMiddleware;

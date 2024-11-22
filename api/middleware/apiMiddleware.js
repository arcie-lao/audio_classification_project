const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');
const ApiUsage = require('../models/apiUsageModel');

// Middleware to authenticate API token
const apiMiddleware = async (req, res, next) => {
    // Try to get token from Authorization header or cookies
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Check if no token in headers, then try cookies
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ error: 'API token or session cookie required' });
    }

    try {
        // Verify the token
        const decoded = jwtHelper.verifyToken(token);
        const user = await User.getUserByEmail(decoded.email);

        // Check if the token matches the one stored in the database
        if (!user) {
            return res.status(403).json({ error: 'Invalid API token or session cookie' });
        }

        ApiUsage.incrementUsage(user.id);

        // Check API usage for non-admin users
        if (user.api_usage > 20 && user.role === 'user') {
            req.apiWarning = 'API limit exceeded 20 uses';
        }

        req.user = user; // Attach user data to request
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired API token or session cookie' });
    }
};

module.exports = apiMiddleware;

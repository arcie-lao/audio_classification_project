const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to authenticate API token
exports.authenticateApiToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'API token required' });
    }
    
    try {
        const decoded = jwtHelper.verifyToken(token);
        // const user = await User.getUserByEmail(decoded.email);

        // Check if the token matches the one stored in the database
        // if (!user || user.api_token !== token) {
        //     return res.status(403).json({ error: 'Invalid API token' });
        // }

        // req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired API token' });
    }
};


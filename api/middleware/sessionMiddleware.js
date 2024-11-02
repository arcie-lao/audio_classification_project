const jwtHelper = require('../utils/jwtHelper');

const sessionMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log('Cookies:', req.cookies);
    console.log('Session token:', token);
    if (!token) return res.status(401).json({ error: 'Session token missing' });

    try {
        const verified = jwtHelper.verifyToken(token);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid session token' });
    }
};

module.exports = sessionMiddleware;

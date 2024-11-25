const jwtHelper = require('../utils/jwtHelper');
const messages = require('../config/middlewaresMessages/sessionMessages.json');

const sessionMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: messages.errors.sessionTokenMissing });
    }

    try {
        const verified = jwtHelper.verifyToken(token);
        req.user = verified; // Attach verified user data to request
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: messages.errors.invalidSessionToken });
    }
};

module.exports = sessionMiddleware;

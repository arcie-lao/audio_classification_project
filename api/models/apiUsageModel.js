const db = require('../config/db');

exports.getUsageByUserId = async (userId) => {
    const query = 'SELECT api_usage FROM users WHERE id = ?';
    const [rows] = await db.promise().query(query, [userId]);
    return rows[0]; // Return the usage object or undefined if not found
};

exports.incrementUsage = async (userId) => {
    const query = 'UPDATE users SET api_usage = api_usage + 1 WHERE id = ?';
    await db.promise().query(query, [userId]);
    const updatedUsage = await this.getUsageByUserId(userId);
    return updatedUsage;
};

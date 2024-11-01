const db = require('../config/db');

exports.getUsageByUserId = async (userId) => {
    const query = 'SELECT * FROM api_usage WHERE user_id = ?';
    const [rows] = await db.promise().query(query, [userId]);
    return rows[0]; // Return the usage object or undefined if not found
};

exports.incrementUsage = async (userId) => {
    const query = 'UPDATE api_usage SET count = count + 1 WHERE user_id = ?';
    await db.promise().query(query, [userId]);
    const updatedUsage = await this.getUsageByUserId(userId);
    return updatedUsage;
};

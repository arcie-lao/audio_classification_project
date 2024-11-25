const db = require('../config/db');

exports.getUsageByUserId = async (userId) => {
    const query = 'SELECT api_usage FROM users WHERE id = ?';
    const [rows] = await db.promise().query(query, [userId]);
    return rows[0]; // Return the usage object or undefined if not found
};

exports.getApiUsageStats = async () => {
    const query = 'SELECT * FROM APIUsageStats';
    const [rows] = await db.promise().query(query);
    return rows;
};

exports.incrementUsage = async (userId) => {
    const query = 'UPDATE users SET api_usage = api_usage + 1 WHERE id = ?';
    await db.promise().query(query, [userId]);
    const updatedUsage = await this.getUsageByUserId(userId);
    return updatedUsage;
};

exports.incrementApiUsage = async (method, endpoint) => {
    // Ensure the endpoint starts with /api/
    endpoint = '/api' + endpoint;

    const [existingEndpoint] = await db.promise().query(
        `SELECT * FROM APIUsageStats WHERE method = ? AND endpoint = ?`,
        [method, endpoint]
    );

    if (existingEndpoint.length > 0) {
        await db.promise().query(
            `UPDATE APIUsageStats SET requestCount = requestCount + 1 WHERE id = ?`,
            [existingEndpoint[0].id]
        );
    } else {
        await db.promise().query(
            `INSERT INTO APIUsageStats (method, endpoint, requestCount) VALUES (?, ?, 1)`,
            [method, endpoint]
        );
    }
};

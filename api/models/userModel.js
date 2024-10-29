const db = require('../config/db');

exports.createUser = async (userData) => {
    // SQL query to insert user data
    const query = 'INSERT INTO users (email, password, api_token) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(query, [userData.email, userData.password, userData.apiToken]);
    return { id: result.insertId, ...userData };
};

exports.getUserByEmail = (email) => {
    // SQL query to find user by email
};

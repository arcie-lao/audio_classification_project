const db = require('../config/db');

exports.createUser = async (userData) => {
    // SQL query to insert user data
    const query = 'INSERT INTO users (email, password, api_token) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(query, [userData.email, userData.password, userData.apiToken]);
    return { id: result.insertId, ...userData };
};

exports.getUserByEmail = async (email) => {
    // SQL query to find user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.promise().query(query, [email]);
    return rows[0]; // Return the user object or undefined if not found
};

exports.getAllUsers = async () => {
    const query = 'SELECT * FROM users';
    const [rows] = await db.promise().query(query);
    return rows;
}
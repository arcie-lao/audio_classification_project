const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');
const ApiUsage = require('../models/apiUsageModel');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiToken = jwtHelper.generateToken({ email: email });

        const user = await User.createUser({ email: email, password: hashedPassword , apiToken: apiToken });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'User registration failed' });
    }};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.cookie('auth_token', token, { httpOnly: true, secure: true }).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
};
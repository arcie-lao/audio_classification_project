const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');
const ApiUsage = require('../models/apiUsageModel');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiToken = jwtHelper.generateToken({ email: email });

        const user = await User.createUser({ email: email, password: hashedPassword, apiToken: apiToken });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'User registration failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.status(201).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};
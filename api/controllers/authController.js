const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');

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

        const sessionToken = jwtHelper.generateToken({ email, userId: user.id }, {expiresIn: '1h'});

        // Set session token as httpOnly cookie with SameSite attribute
        res.cookie('token', sessionToken,
            { 
                httpOnly: true,
                secure: true,   // Omit this for localhost
                sameSite: 'None' // 'Lax' for localhost
            })
            .status(200).json({ message: 'Login successful', userId: user.id, role: user.role });
        } catch (err) {
        console.error('Login error:', err); // Log the error
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.getUserByEmail(req.user.email);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(user.id, hashedPassword);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Password update error:', err);
        res.status(500).json({ error: 'Password update failed' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
};

exports.getSession = async (req, res) => {
    try {
        const user = req.user; // Extracted from the token in the middleware

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user details and role
        res.status(200).json({
            message: 'Session is valid',
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error('Session validation error:', err);
        res.status(500).json({ error: 'Session validation failed' });
    }
};


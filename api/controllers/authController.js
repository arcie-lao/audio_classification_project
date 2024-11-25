const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');
const messages = require('../config/controllersMessages/authMessages.json');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: messages.errors.emailRegistered });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiToken = jwtHelper.generateToken({ email: email });

        const user = await User.createUser({ email: email, password: hashedPassword, apiToken: apiToken });

        res.status(201).json({ message: messages.success.userRegistered });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: messages.errors.registrationFailed });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: messages.errors.invalidCredentials });
        }

        const sessionToken = jwtHelper.generateToken({ email, userId: user.id }, { expiresIn: '1h' });

        res.cookie('token', sessionToken, {
            httpOnly: false, // Adjust based on your environment
            // secure: true, // Uncomment for HTTPS
            // sameSite: 'None' // Adjust based on your environment
        })
            .status(200)
            .json({
                message: messages.success.loginSuccessful,
                userId: user.id,
                role: user.role,
            });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: messages.errors.loginFailed });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.getUserByEmail(req.user.email);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ error: messages.errors.invalidCredentials });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(user.id, hashedPassword);

        res.json({ message: messages.success.passwordUpdated });
    } catch (err) {
        console.error('Password update error:', err);
        res.status(500).json({ error: messages.errors.passwordUpdateFailed });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token').json({ message: messages.success.logoutSuccessful });
};

exports.getSession = async (req, res) => {
    try {
        const user = req.user; // Extracted from the token in the middleware

        if (!user) {
            return res.status(404).json({ error: messages.errors.userNotFound });
        }

        res.status(200).json({
            message: messages.success.sessionValid,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error('Session validation error:', err);
        res.status(500).json({ error: messages.errors.sessionValidationFailed });
    }
};

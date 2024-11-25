const ApiUsage = require('../models/apiUsageModel');
const User = require('../models/userModel');
const messages = require('../config/controllersMessages/adminMessages.json');

// Function to get usage count by user ID
exports.getUsage = async (req, res) => {
    const userId = req.user.userId;
    try {
        const usage = await ApiUsage.getUsageByUserId(userId);
        if (!usage) {
            return res.status(404).json({ error: messages.errors.usageNotFound });
        }
        res.json({ usage });
    } catch (err) {
        console.error('Error fetching usage:', err);
        res.status(500).json({ error: messages.errors.fetchUsageFailed });
    }
};

// Function to increment usage count by user ID
exports.incrementUsage = async (req, res) => {
    const userId = req.user.userId;
    try {
        await ApiUsage.incrementUsage(userId);
        res.json({ message: messages.success.incrementUsageSuccess });
    } catch (err) {
        console.error('Error incrementing usage:', err);
        res.status(500).json({ error: messages.errors.incrementUsageFailed });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json({ users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: messages.errors.fetchUsersFailed });
    }
};

exports.deleteUserByEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: messages.errors.userNotFound });
        }

        await User.deleteUserByEmail(email);
        res.json({ message: messages.success.userDeletionSuccess });
    } catch (err) {
        console.error('User deletion error:', err);
        res.status(500).json({ error: messages.errors.userDeletionFailed });
    }
};

exports.getApiUsageStats = async (req, res) => {
    try {
        const stats = await ApiUsage.getApiUsageStats();
        res.json({ stats });
    } catch (err) {
        console.error('Error fetching API usage stats:', err);
        res.status(500).json({ error: messages.errors.fetchApiStatsFailed });
    }
}

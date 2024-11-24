const ApiUsage = require('../models/apiUsageModel');
const User = require('../models/userModel');

// Function to get usage count by user ID
exports.getUsage = async (req, res) => {
    // console.log('User:', req.user);
    const userId = req.user.userId;
    try {
        const usage = await ApiUsage.getUsageByUserId(userId);
        if (!usage) {
            return res.status(404).json({ error: 'Usage data not found' });
        }
        res.json({ usage });
    } catch (err) {
        console.error('Error fetching usage:', err);
        res.status(500).json({ error: 'Failed to fetch usage data' });
    }
};

// Function to increment usage count by user ID
exports.incrementUsage = async (req, res) => {
    const userId = req.user.userId;
    try {
        await ApiUsage.incrementUsage(userId);
        res.json({ message: 'Usage incremented successfully' });
    } catch (err) {
        console.error('Error incrementing usage:', err);
        res.status(500).json({ error: 'Failed to increment usage count' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json({ users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};

exports.deleteUserByEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.deleteUserByEmail(email);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('User deletion error:', err);
        res.status(500).json({ error: 'User deletion failed' });
    }
};

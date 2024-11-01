const ApiUsage = require('../models/apiUsageModel');

// Function to get usage count by user ID
exports.getUsage = async (req, res) => {
    console.log('User:', req.user);
    const userId = req.user.id; // Assuming user is authenticated and user ID is available in `req.user`
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
    const userId = req.user.id;
    try {
        await ApiUsage.incrementUsage(userId);
        res.json({ message: 'Usage incremented successfully' });
    } catch (err) {
        console.error('Error incrementing usage:', err);
        res.status(500).json({ error: 'Failed to increment usage count' });
    }
};

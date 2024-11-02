const ApiUsage = require('../models/apiUsageModel');

exports.testCallback = async (req, res) => {
    console.log('User:', req.user);
    await ApiUsage.incrementUsage(req.user.id);
    console.log('Usage incremented', req.user.api_usage);
    res.json({ message: 'Callback successful' });
};


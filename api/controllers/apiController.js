const ApiUsage = require('../models/apiUsageModel');

exports.testCallback = async (req, res) => {
    await ApiUsage.incrementUsage(req.user.id);
    res.json({ message: 'Callback successful' });
};


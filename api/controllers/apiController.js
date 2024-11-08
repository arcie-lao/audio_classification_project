const ApiUsage = require('../models/apiUsageModel');

exports.testCallback = async (req, res) => {
    await ApiUsage.incrementUsage(req.user.id);
    res.json({ message: 'Callback successful' });
};

exports.analyzeAudio = async (req, res) => {
    try {
        // Increment API usage for tracking
        await ApiUsage.incrementUsage(req.user.id);

        // Read the audio data
        const audioData = req.body;

        console.log(audioData);

        // Send audio data to Azure server
        const response = await fetch(
            process.env.AST_URL, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${process.env.AST_KEY}`,
                    "Content-Type": "audio/flac"
                },
                method: 'POST',
                body: audioData
            }
        )

        const result = await response.json();

        // Send response back to frontend
        res.json({ message: 'Audio analyzed successfully', data: result });

    } catch (error) {
        console.error('Error analyzing audio:', error);
        res.status(500).json({ error: 'Audio analysis failed' });
    }
}

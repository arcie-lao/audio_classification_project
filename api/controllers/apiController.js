exports.testCallback = async (req, res) => {
    res.json({ message: 'Callback successful' });
};

exports.analyzeAudio = async (req, res) => {
    try {
        // Increment API usage for tracking
        console.log(req.body);

        // Read the audio data
        const audioData = Buffer.from(req.body);

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
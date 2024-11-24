const multer = require('multer');

exports.testCallback = async (req, res) => {
    res.json({ message: 'Callback successful' });
};

const upload = multer();

exports.analyzeAudio = [
    upload.array('audioFiles[]'),
    async (req, res) => {
        try {
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            // Process each file and send it to Azure server
            const promises = files.map(file =>
                fetch(process.env.AST_URL, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${process.env.AST_KEY}`,
                        "Content-Type": "audio/flac"
                    },
                    method: 'POST',
                    body: file.buffer
                }).then(response => response.json())
            );

            const results = await Promise.all(promises);

            res.json({ message: 'All files analyzed', data: results });
        } catch (error) {
            console.error('Error analyzing files:', error);
            res.status(500).json({ error: 'Audio analysis failed' });
        }
    }
];

exports.analyzeMultipleAudioSequential = [
    upload.array('audioFiles[]'),
    async (req, res) => {
        try {
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const sequentialResults = [];

            for (const audioData of files) {
                const response = await fetch(process.env.AST_URL, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${process.env.AST_KEY}`,
                        "Content-Type": "audio/flac"
                    },
                    method: 'POST',
                    body: audioData.buffer
                });
    
                const result = await response.json();
                sequentialResults.push(result);
            }

            res.json({ message: 'All files analyzed', data: sequentialResults });
        } catch (error) {
            console.error('Error analyzing files:', error);
            res.status(500).json({ error: 'Audio analysis failed' });
        }
    }
];

/**
 * This function calculates the cumulative scores for each label in the input data. 
 * Score is normalized.
 */
exports.calculateScoreData = async (req, res) => {
    try {
        const data  = req.body;

        // Validate the input
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'No valid data provided' });
        }

        // Object to store cumulative scores for each label
        const labelScores = {};

        // Iterate over each nested array
        data.forEach((itemArray) => {
            itemArray.forEach(({ label, score }) => {
                if (!labelScores[label]) {
                    labelScores[label] = 0;
                }
                labelScores[label] += score; // Add score to the cumulative score for the label
            });
        });

        // Find the label with the highest cumulative score
        var sortedLabels = Object.entries(labelScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .map(([label, score]) => ({ label, score }));

        const topLabel = sortedLabels[0];

        // Normalize the scores
        sortedLabels = normalizeScores(sortedLabels);

        res.json({
            message: 'Scores summarized',
            cumulativeScores: sortedLabels,
            topLabel
        });
    } catch (error) {
        console.error('Error summarizing scores:', error);
        res.status(500).json({ error: 'Score summarization failed' });
    }
};

// Normalize the scores
const normalizeScores = (data) => {
    // Calculate the total score
    const totalScore = data.reduce((sum, item) => sum + item.score, 0);

    // Normalize each score
    return data.map(({ label, score }) => ({
        label,
        score: score / totalScore
    }));
};

const multer = require('multer');
const messages = require('../config/controllersMessages/apiMessages.json');

exports.testCallback = async (req, res) => {
    res.json({ message: messages.success.callbackSuccess });
};

const upload = multer();

exports.analyzeAudioV1 = async (req, res) => {
    try {
        console.log(req.body);
        const audioData = Buffer.from(req.body);

        const response = await fetch(process.env.AST_URL, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${process.env.AST_KEY}`,
                "Content-Type": "audio/flac"
            },
            method: 'POST',
            body: audioData
        });

        const result = await response.json();

        res.json({ message: messages.success.audioAnalyzedSuccess, data: result });
    } catch (error) {
        console.error('Error analyzing audio:', error);
        res.status(500).json({ error: messages.errors.analyzeAudioFailed });
    }
};

exports.analyzeAudio = [
    upload.array('audioFiles[]'),
    async (req, res) => {
        try {
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ error: messages.errors.filesNotUploaded });
            }

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

            res.json({ message: messages.success.filesAnalyzedSuccess, data: results, apiWarning: req.apiWarning });
        } catch (error) {
            console.error('Error analyzing files:', error);
            res.status(500).json({ error: messages.errors.analyzeAudioFailed });
        }
    }
];

exports.analyzeMultipleAudioSequential = [
    upload.array('audioFiles[]'),
    async (req, res) => {
        try {
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ error: messages.errors.filesNotUploaded });
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

            res.json({ message: messages.success.filesAnalyzedSuccess, data: sequentialResults, apiWarning: req.apiWarning });
        } catch (error) {
            console.error('Error analyzing files:', error);
            res.status(500).json({ error: messages.errors.analyzeAudioFailed });
        }
    }
];

exports.calculateScoreData = async (req, res) => {
    try {
        const data = req.body;

        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: messages.errors.invalidData });
        }

        const labelScores = {};

        data.forEach((itemArray) => {
            itemArray.forEach(({ label, score }) => {
                if (!labelScores[label]) {
                    labelScores[label] = 0;
                }
                labelScores[label] += score;
            });
        });

        let sortedLabels = Object.entries(labelScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .map(([label, score]) => ({ label, score }));

        const topLabel = sortedLabels[0];

        sortedLabels = normalizeScores(sortedLabels);

        res.json({
            message: messages.success.scoresSummarized,
            cumulativeScores: sortedLabels,
            apiWarning: req.apiWarning
        });
    } catch (error) {
        console.error('Error summarizing scores:', error);
        res.status(500).json({ error: messages.errors.scoreSummarizationFailed });
    }
};

const normalizeScores = (data) => {
    const totalScore = data.reduce((sum, item) => sum + item.score, 0);

    return data.map(({ label, score }) => ({
        label,
        score: score / totalScore
    }));
};

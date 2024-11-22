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

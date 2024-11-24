require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.raw({ type: 'audio/*', limit: '50mb' }));
app.use(cors({
  origin: true, // frontend origin
  methods: 'GET,POST,OPTIONS,PUT',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true // To allow cookies with the frontend
}));

// Routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/4537_project/auth', authRoutes);
app.use('/4537_project/api', apiRoutes);
app.use('/4537_project/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen();

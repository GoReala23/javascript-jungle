const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;

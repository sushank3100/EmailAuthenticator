const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const app = express();

// database connection
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API IS RUNNING'));

// create routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/email-activate',require('./routes/api/activation'));
app.use('/api/forgot-password',require('./routes/api/forgotPassword'));
app.use('/api/reset-password',require('./routes/api/resetPassword'));

const PORT = process.env.PORT || 1010;

app.listen(PORT, () => console.log(`Server is Listening on ${PORT}`));

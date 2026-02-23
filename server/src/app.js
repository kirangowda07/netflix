const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://netflix-clone.vercel.app', 'https://netflix-clone-kirangowda07.vercel.app']
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Netflix Clone API is running');
});

module.exports = app;

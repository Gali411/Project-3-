import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// import path from 'node:path';
// import db from './config/connection.js';
// import routes from './routes/index.js';

import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));

// app.use(routes);
app.get('/api/similar', async (req, res) => {
  const artist = req.query.artist;
  if (!artist) {
    return res.status(400).send({ error: 'Artist is required' });
  }
  try {
    const response = await axios.get('https://tastedive.com/api/similar', {
      params: {
        q: artist,
        type: 'music',
        k: process.env.APIKEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${3001}!`)
})
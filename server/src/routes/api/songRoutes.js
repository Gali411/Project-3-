import express from 'express';
import axios from 'axios';

const router = express.Router();

const DEEZER_API_URL = 'https://api.deezer.com/search';

router.get('/random-song', async (req, res) => {
  try {
    console.log('Fetching random song from Deezer...');
    const response = await axios.get(DEEZER_API_URL, {
      params: { q: 'random' },
      timeout: 5000,  
      headers: {
        'User-Agent': 'YourAppName/1.0',  
      },
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      console.log('No songs found from Deezer');
      return res.status(404).json({ message: 'No songs found from Deezer' });
    }

    const song = response.data.data[0];
    console.log('Song found:', song);
    res.json(song);
  } catch (error) {
    console.error('Error fetching data from Deezer:', error);
    res.status(500).json({ message: 'Error fetching random song from Deezer', error: error.message });
  }
});

export default router;

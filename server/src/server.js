import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  }
};

app.get('/api/similar', async (req, res) => {
  const artist = req.query.artist;
  try {
    const similarArtistResponse = await fetch(`https://tastedive.com/api/similar?q=${artist}&type=music&k=${process.env.APIKEY}`);
    const similarArtistData = await similarArtistResponse.json();
    
    if (!similarArtistData || !similarArtistData.similar || !similarArtistData.similar.results.length) {
      console.error("No similar artists found.");
      return res.status(404).json({ error: "No similar artists found." });
    }

    const similarArtists = similarArtistData.similar.results.map(artist => artist.name);

    const artistTopTracksPromises = similarArtists.map(async (artistName) => {
      const lastFmResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName}&api_key=${process.env.LASTFM_API_KEY}&format=json`);
      const lastFmData = await lastFmResponse.json();

      const lastFmArtistResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${process.env.LASTFM_API_KEY}&format=json`);
      const lastFmArtistData = await lastFmArtistResponse.json();

      const artistImage = lastFmArtistData.artist?.image?.find(image => image.size === 'mega')?.url || '';

      if (!lastFmData.toptracks || !lastFmData.toptracks.track.length) {
        console.error(`No top tracks found for ${artistName}.`);
        return null;
      }

      const randomTrackIndex = Math.floor(Math.random() * lastFmData.toptracks.track.length);
      const randomTrack = lastFmData.toptracks.track[randomTrackIndex];

      const track = {
        name: randomTrack.name,
        url: randomTrack.url,
      };

      return {
        artistName,
        track,
        image: artistImage,
      };
    });

    const similarArtistsWithRandomTrack = await Promise.all(artistTopTracksPromises);
    
    const filteredSimilarArtists = similarArtistsWithRandomTrack.filter(item => item !== null);

    if (!filteredSimilarArtists.length) {
      return res.status(404).json({ error: "No top tracks found for similar artists." });
    }

    shuffleArray(filteredSimilarArtists);

    res.json({
      similarArtists: filteredSimilarArtists,
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
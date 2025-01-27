import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'node:path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/similar', async (req, res) => {
  const artist = req.query.artist;
  try {
    const similarArtistResponse = await fetch(`https://tastedive.com/api/similar?q=${artist}&type=music&k=${process.env.APIKEY}`);
    const similarArtistData = await similarArtistResponse.json();
    
    if (!similarArtistData || !similarArtistData.similar || !similarArtistData.similar.results.length) {
      console.error("No similar artists found.");
      return;
    }

    const similarArtist = similarArtistData.similar.results[0].name;
    console.log(`Similar artist found: ${similarArtist}`);

    const lastFmResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${similarArtist}&api_key=${process.env.LASTFM_API_KEY}&format=json`);
    const lastFmData = await lastFmResponse.json();
    
    if (!lastFmData.toptracks || !lastFmData.toptracks.track.length) {
      console.error("No top tracks found for the similar artist.");
      return;
    }

    console.log(`Top tracks for ${similarArtist}:`);
    lastFmData.toptracks.track.forEach((track, index) => {
      console.log(`${index + 1}. ${track.name} - Played ${track.playcount} times`);
      console.log(`   Listen here: ${track.url}`);
    });

    const tracks = lastFmData.toptracks.track.map((track, index) => ({
      rank: index + 1,
      name: track.name,
      playcount: track.playcount,
      url: track.url,
    }));

    res.json({
      similarArtist,
      tracks,
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }

})

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});

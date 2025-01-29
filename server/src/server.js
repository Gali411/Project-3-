
import dotenv from 'dotenv';
import axios from 'axios';
import express from 'express';
import path from 'node:path';
//import type { Request, Response } from 'express';
import db from './config/db.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
//import { typeDefs, resolvers } from './schemas/index.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import { authenticateToken } from './utils/auth.js';

import { fileURLToPath } from 'url';

const server = new ApolloServer({
  typeDefs,
  resolvers
});




dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//app.use('/assets', express.static(path.join(__dirname, 'assets')));

//app.use('/images', express.static('./assets'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the static directory
app.use(express.static(path.join(__dirname, 'assets')));


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

      //const artistImage = lastFmArtistData.artist?.image?.find(image => image.size === 'mega')?.url || '';
      const artistImage = '/images/marcela-laskoski-YrtFlrLo2DQ-unsplash.jpg';

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


const startApolloServer = async () => {


  await server.start();
  await db();



  app.use('/graphql', expressMiddleware(server,
    {
      context: authenticateToken
    }
  ));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });

};

startApolloServer();



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
const PORT = process.env.PORT || 3002;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//app.use('/assets', express.static(path.join(__dirname, 'assets')));

//app.use('/images', express.static('./assets'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the static directory
app.use(express.static(path.join(__dirname, '/assets')));


const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  }
};

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

async function getAccessToken() {
  const url = 'https://accounts.spotify.com/api/token';
  const headers = {
    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const body = 'grant_type=client_credentials';

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body
  });

  const data = await response.json();
  return data.access_token;
}

async function getArtistInfo(artistId) {
  const accessToken = await getAccessToken();
  const url = `https://api.spotify.com/v1/artists/${artistId}`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });

  const data = await response.json();
  return data;
}

async function searchArtist(name) {
  const accessToken = await getAccessToken();
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });

  const data = await response.json();
  return data.artists.items[0].id; 
}

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
      const artistId = await searchArtist(artistName);

      const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
        },
      });

      const topTracksData = await topTracksResponse.json();
      
      if (!topTracksData.tracks || topTracksData.tracks.length === 0) {
        console.error(`No top tracks found for ${artistName}.`);
        return null;
      }

      const randomTrackIndex = Math.floor(Math.random() * topTracksData.tracks.length);
      const randomTrack = topTracksData.tracks[randomTrackIndex];

      const artistInfo = await getArtistInfo(artistId);
      const artistImage = artistInfo.images && artistInfo.images.length > 0 ? artistInfo.images[0].url : null;

      return {
        artistName,
        track: {
          name: randomTrack.name,
          url: randomTrack.external_urls.spotify, 
        },
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
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });

};

startApolloServer();

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import context from './graphql/context.js';
import axios from 'axios';

dotenv.config();

const app = express();
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

await server.start();
server.applyMiddleware({ app });

app.use(cors()); 
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
});


import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'node:path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = '/Users/gabriel11harris030/Downloads/class/Project-3/';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (_req, res) => {
  const filePath = path.join(__dirname, '/client/dist/index.html');
  res.sendFile(filePath);
});

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

  } catch (error) {
    console.error("Error fetching data:", error);
  }

})

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});

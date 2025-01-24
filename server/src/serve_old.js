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

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import context from './graphql/context.js';

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
});
// h
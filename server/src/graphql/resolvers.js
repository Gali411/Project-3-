import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

import User from '../models/user.js';



const resolvers = {
  Query: {
    getUsers: async (_, __, { models }) => {
      return await User.find({});
    },
    getUser: async (_, { id }, { models }) => {
      const user = await User.findById(id);
      if (!user) throw new AuthenticationError('User not found');
      return user;
    },
  },
  Mutation: {

    loginUser: async (_, { username, password }, { models }) => {
      const user = await User.findOne({ username });
      if (!user) throw new AuthenticationError('Invalid username or password');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AuthenticationError('Invalid username or password');
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },

    registerUser: async (_, { username, email, password }, { models }) => {



      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ username, email, password: hashedPassword });






      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user };

    },

    updateUser: async (_, { id, username, email }, { models }) => {
      const updates = { ...(username && { username }), ...(email && { email }) };
      return await User.findByIdAndUpdate(id, updates, { new: true });
    },

    deleteUser: async (_, { id }, { models }) => {
      return await User.findByIdAndDelete(id);
    },

  },
};

export default resolvers;

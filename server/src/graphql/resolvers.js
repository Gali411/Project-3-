import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const resolvers = {
  Query: {
    getUsers: async (_, __, { models }) => {
      return await models.User.find({});
    },
    getUser: async (_, { id }, { models }) => {
      const user = await models.User.findById(id);
      if (!user) throw new AuthenticationError('User not found');
      return user;
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password }, { models }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await models.User.create({ username, email, password: hashedPassword });
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },
    loginUser: async (_, { email, password }, { models }) => {
      const user = await models.User.findOne({ email });
      if (!user) throw new AuthenticationError('Invalid email or password');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AuthenticationError('Invalid email or password');
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },
    updateUser: async (_, { id, username, email }, { models }) => {
      const updates = { ...(username && { username }), ...(email && { email }) };
      return await models.User.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteUser: async (_, { id }, { models }) => {
      return await models.User.findByIdAndDelete(id);
    },
  },
};

export default resolvers;

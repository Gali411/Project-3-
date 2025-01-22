import { AuthenticationError } from 'apollo-server-express';

const authenticate = (context) => {
  const { user } = context;
  if (!user) throw new AuthenticationError('Authentication required');
};

export default authenticate;

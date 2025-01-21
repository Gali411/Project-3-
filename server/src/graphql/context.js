import jwt from 'jsonwebtoken';

const context = ({ req }) => {
  const token = req.headers.authorization || '';
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return { user };
    } catch (err) {
      console.error('Invalid token:', err.message);
    }
  }
  return {};
};

export default context;

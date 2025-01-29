import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  console.log('Connecting to database...', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return mongoose.connection;
    console.log('Database connected successfully');
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;

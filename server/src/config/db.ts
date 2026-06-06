import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Drop stale username index from previous schema version
    try {
      await conn.connection.db?.collection('users').dropIndex('username_1');
      console.log('Dropped stale username_1 index');
    } catch {
      // index doesn't exist — that's fine
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

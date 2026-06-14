const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGO_URI) {
    // eslint-disable-next-line no-console
    console.error('FATAL ERROR: MONGO_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    // Disable buffering so queries fail immediately if not connected
    mongoose.set('bufferCommands', false);

    await mongoose.connect(process.env.MONGO_URI);
    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error. Full error details:', error);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB runtime connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('MongoDB disconnected');
  });
}

module.exports = connectDB;

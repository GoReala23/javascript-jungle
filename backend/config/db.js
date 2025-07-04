const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@adhdcluster.o6lnpsu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

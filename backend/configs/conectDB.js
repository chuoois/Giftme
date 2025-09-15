const mongoose = require('mongoose');
const { env } = require('./environment');

const connectDB = async () => {
  try {
    await mongoose.connect(`${env.MONGODB_URL}/${env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
    console.log('📌 Connected DB name:', mongoose.connection.name);
    console.log('📌 Connected host:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

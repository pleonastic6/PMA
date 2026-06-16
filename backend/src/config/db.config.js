const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
try {
    await mongoose.connect(mongoUri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await mongoose.disconnect();
  }
};

module.exports = connectDB;
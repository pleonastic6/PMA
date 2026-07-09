const mongoose = require('mongoose');
const config = require('../config/env.config');

async function connectDatabase(mongoUri = config.mongoUri) {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (mongoose.connection.readyState === 2) {
        await mongoose.connection.asPromise();
        return mongoose.connection;
    }

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
    });

    return mongoose.connection;
}

async function disconnectDatabase() {
    if (mongoose.connection.readyState === 0) {
        return;
    }

    await mongoose.disconnect();
}

module.exports = {
    mongoose,
    connectDatabase,
    disconnectDatabase,
};

const app = require('./app');
const config = require('./config/env.config');
const connectDB = require('./config/db.config');


const startServer = async () => {
    await connectDB(config.mongoUri);
    app.listen(config.port, () => {
        console.log(`Backend läuft im ${config.environment}-Modus auf Port ${config.port}`);
    });
};

startServer();
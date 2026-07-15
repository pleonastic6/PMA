const app = require('./app');
const config = require('./config/env.config');
const { connectDatabase } = require('./db/mongoose');

async function startServer() {
    await connectDatabase();

    app.listen(config.port, () => {
        console.log(`Backend läuft im ${config.environment}-Modus auf Port ${config.port}`);
    });
}

startServer().catch((error) => {
    console.error('Fehler beim Starten des Backends:', error);
    process.exit(1);
});

const app = require('./app');
const config = require('./config/env.config');

app.listen(config.port, () => {
    console.log(`Backend läuft im ${config.environment}-Modus auf Port ${config.port}`);
});
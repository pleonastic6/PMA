const { mongoose } = require('../db/mongoose');

exports.getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: {
                readyState: mongoose.connection.readyState,
            },
        },
    });
};

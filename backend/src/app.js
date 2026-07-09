const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api.routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Standard-Middlewares
app.use(cors()); 
app.use(express.json()); // Wichtig für req.body bei POST-Requests

// Der Master-Router wird unter einem Prefix eingehängt (z.B. /api/v1)
app.use('/api/v1', apiRoutes);

// Fallback für Routen, die es nicht gibt
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

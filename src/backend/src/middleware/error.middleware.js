function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Route nicht gefunden: ${req.method} ${req.originalUrl}`,
    });
}

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Interner Serverfehler';

    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
}

module.exports = {
    notFoundHandler,
    errorHandler,
};

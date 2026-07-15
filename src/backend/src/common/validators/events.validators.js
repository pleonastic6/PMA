const { AppError } = require('../errors/app-error');
const { normalizePosition } = require('../utils/demo-geo');

function isPastEvent(date, time) {
    const eventTimestamp = new Date(`${date}T${time}:00`);

    if (Number.isNaN(eventTimestamp.getTime())) {
        throw new AppError(400, 'Event-Datum oder Uhrzeit ist ungueltig');
    }

    return eventTimestamp.getTime() < Date.now();
}

function validateCreateEventBody(body) {
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    const date = String(body.date || '').trim();
    const time = String(body.time || '').trim();
    const locationName = String(body.locationName || '').trim();
    const category = String(body.category || 'Sonstiges').trim();
    const position = Object.prototype.hasOwnProperty.call(body, 'position')
        ? normalizePosition(body.position)
        : null;

    if (!title) {
        throw new AppError(400, 'Event-Titel ist erforderlich');
    }

    if (!description) {
        throw new AppError(400, 'Event-Beschreibung ist erforderlich');
    }

    if (!date) {
        throw new AppError(400, 'Event-Datum ist erforderlich');
    }

    if (!time) {
        throw new AppError(400, 'Event-Uhrzeit ist erforderlich');
    }

    if (!locationName) {
        throw new AppError(400, 'Event-Ort ist erforderlich');
    }

    if (isPastEvent(date, time)) {
        throw new AppError(400, 'Events duerfen nicht in der Vergangenheit liegen');
    }

    if (Object.prototype.hasOwnProperty.call(body, 'position') && !position) {
        throw new AppError(400, 'position muss ein Array aus [latitude, longitude] sein');
    }

    return {
        title,
        description,
        date,
        time,
        locationName,
        category: category || 'Sonstiges',
        position,
    };
}

function validateUpdateEventBody(body) {
    return validateCreateEventBody(body);
}

module.exports = {
    validateCreateEventBody,
    validateUpdateEventBody,
};

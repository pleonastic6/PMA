const { AppError } = require('../errors/app-error');

function sanitizeString(value) {
    return typeof value === 'string' ? value.trim() : value;
}

function validateProfileUpdateBody(body) {
    const allowedFields = [
        'firstName',
        'lastName',
        'displayName',
        'bio',
        'birthDate',
        'gender',
        'location',
        'icebreaker',
        'meetupStatus',
    ];
    const update = {};

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            update[field] = sanitizeString(body[field]);
        }
    }

    if (Object.prototype.hasOwnProperty.call(body, 'interests')) {
        if (!Array.isArray(body.interests)) {
            throw new AppError(400, 'interests muss ein Array sein');
        }
        update.interests = body.interests.map((value) => String(value).trim()).filter(Boolean);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'languages')) {
        if (!Array.isArray(body.languages)) {
            throw new AppError(400, 'languages muss ein Array sein');
        }
        update.languages = body.languages.map((value) => String(value).trim()).filter(Boolean);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'pictures')) {
        if (!Array.isArray(body.pictures)) {
            throw new AppError(400, 'pictures muss ein Array sein');
        }
        update.pictures = body.pictures.map((value) => String(value).trim()).filter(Boolean);
    }

    if (Object.keys(update).length === 0) {
        throw new AppError(400, 'Keine gueltigen Profilfelder uebergeben');
    }

    return update;
}

function validatePreferencesUpdateBody(body) {
    const update = {};

    if (Object.prototype.hasOwnProperty.call(body, 'minAge')) {
        const minAge = Number(body.minAge);
        if (!Number.isInteger(minAge) || minAge < 18) {
            throw new AppError(400, 'minAge muss eine ganze Zahl ab 18 sein');
        }
        update.minAge = minAge;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'maxAge')) {
        const maxAge = Number(body.maxAge);
        if (!Number.isInteger(maxAge) || maxAge < 18) {
            throw new AppError(400, 'maxAge muss eine ganze Zahl ab 18 sein');
        }
        update.maxAge = maxAge;
    }

    if (
        Object.prototype.hasOwnProperty.call(update, 'minAge') &&
        Object.prototype.hasOwnProperty.call(update, 'maxAge') &&
        update.minAge > update.maxAge
    ) {
        throw new AppError(400, 'minAge darf nicht groesser als maxAge sein');
    }

    if (Object.keys(update).length === 0) {
        throw new AppError(400, 'Keine gueltigen Preference-Felder uebergeben');
    }

    return update;
}

module.exports = {
    validateProfileUpdateBody,
    validatePreferencesUpdateBody,
};

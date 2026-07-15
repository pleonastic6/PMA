const { AppError } = require('../errors/app-error');

function normalizeEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    return normalized || null;
}

function normalizeUsername(username) {
    return String(username || '').trim().toLowerCase();
}

function validateRegisterBody(body) {
    const username = normalizeUsername(body.username);
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const birthDate = body.birthDate ? String(body.birthDate).trim() : null;
    const gender = body.gender ? String(body.gender).trim().toLowerCase() : 'prefer_not_to_say';
    const location = String(body.location || '').trim();
    const hometown = String(body.hometown || '').trim();
    const bio = String(body.bio || '').trim();
    const displayName = String(body.displayName || body.firstName || '').trim();
    const jobTitle = String(body.jobTitle || '').trim();
    const education = String(body.education || '').trim();
    const lookingFor = String(body.lookingFor || '').trim();
    const icebreaker = String(body.icebreaker || '').trim();
    const favoriteHangout = String(body.favoriteHangout || '').trim();
    const weekendMood = String(body.weekendMood || '').trim();
    const idealSunday = String(body.idealSunday || '').trim();
    const greenFlags = String(body.greenFlags || '').trim();
    const funFact = String(body.funFact || '').trim();

    let interests = [];
    if (Object.prototype.hasOwnProperty.call(body, 'interests')) {
        if (!Array.isArray(body.interests)) {
            throw new AppError(400, 'interests muss ein Array sein');
        }
        interests = body.interests.map((entry) => String(entry).trim()).filter(Boolean);
    }

    let vibeTags = [];
    if (Object.prototype.hasOwnProperty.call(body, 'vibeTags')) {
        if (!Array.isArray(body.vibeTags)) {
            throw new AppError(400, 'vibeTags muss ein Array sein');
        }
        vibeTags = body.vibeTags.map((entry) => String(entry).trim()).filter(Boolean);
    }

    let languages = [];
    if (Object.prototype.hasOwnProperty.call(body, 'languages')) {
        if (!Array.isArray(body.languages)) {
            throw new AppError(400, 'languages muss ein Array sein');
        }
        languages = body.languages.map((entry) => String(entry).trim()).filter(Boolean);
    }

    let pictures = [];
    if (Object.prototype.hasOwnProperty.call(body, 'pictures')) {
        if (!Array.isArray(body.pictures)) {
            throw new AppError(400, 'pictures muss ein Array sein');
        }
        pictures = body.pictures.map((entry) => String(entry).trim()).filter(Boolean);
    }

    if (!username || username.length < 3) {
        throw new AppError(400, 'Username muss mindestens 3 Zeichen lang sein');
    }

    if (email && !email.includes('@')) {
        throw new AppError(400, 'Bitte eine gueltige E-Mail angeben');
    }

    if (password.length < 8) {
        throw new AppError(400, 'Passwort muss mindestens 8 Zeichen lang sein');
    }

    if (!firstName) {
        throw new AppError(400, 'Vorname ist erforderlich');
    }

    return {
        username,
        email,
        password,
        firstName,
        lastName,
        birthDate,
        gender,
        location,
        hometown,
        bio,
        displayName,
        jobTitle,
        education,
        lookingFor,
        interests,
        vibeTags,
        languages,
        icebreaker,
        favoriteHangout,
        weekendMood,
        idealSunday,
        greenFlags,
        funFact,
        pictures,
    };
}

function validateLoginBody(body) {
    const identifier = String(body.identifier || body.username || body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!identifier || !password) {
        throw new AppError(400, 'Username/E-Mail und Passwort sind erforderlich');
    }

    return { identifier, password };
}

module.exports = {
    validateRegisterBody,
    validateLoginBody,
    normalizeEmail,
    normalizeUsername,
};

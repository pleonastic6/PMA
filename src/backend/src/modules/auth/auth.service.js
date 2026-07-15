const { AppError } = require('../../common/errors/app-error');
const { hashPassword, verifyPassword } = require('../../common/utils/password');
const crypto = require('node:crypto');
const { User } = require('../users/user.model');
const { Session } = require('./session.model');

function publicUser(user) {
    const email = String(user.email || '').toLowerCase();

    return {
        id: String(user._id),
        username: user.username,
        email: user.email,
        isDemo: email.endsWith('@pma.local'),
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        bio: user.bio,
        birthDate: user.birthDate,
        gender: user.gender,
        location: user.location,
        hometown: user.hometown,
        jobTitle: user.jobTitle,
        education: user.education,
        lookingFor: user.lookingFor,
        interests: user.interests,
        vibeTags: user.vibeTags,
        languages: user.languages,
        icebreaker: user.icebreaker,
        favoriteHangout: user.favoriteHangout,
        weekendMood: user.weekendMood,
        idealSunday: user.idealSunday,
        greenFlags: user.greenFlags,
        funFact: user.funFact,
        pictures: user.pictures,
        meetupStatus: user.meetupStatus,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

async function register(payload) {
    const existingUser = await User.findOne({
        $or: [
            { username: payload.username },
            ...(payload.email ? [{ email: payload.email }] : []),
        ],
    }).lean();

    if (existingUser) {
        if (existingUser.username === payload.username) {
            throw new AppError(409, 'Username ist bereits vergeben');
        }
        throw new AppError(409, 'E-Mail ist bereits registriert');
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await User.create({
        username: payload.username,
        email: payload.email,
        passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
        birthDate: payload.birthDate,
        gender: payload.gender,
        location: payload.location,
        hometown: payload.hometown || '',
        displayName: payload.displayName || payload.firstName,
        jobTitle: payload.jobTitle || '',
        education: payload.education || '',
        lookingFor: payload.lookingFor || '',
        bio: payload.bio || '',
        interests: payload.interests || [],
        vibeTags: payload.vibeTags || [],
        languages: payload.languages || [],
        icebreaker: payload.icebreaker || '',
        favoriteHangout: payload.favoriteHangout || '',
        weekendMood: payload.weekendMood || '',
        idealSunday: payload.idealSunday || '',
        greenFlags: payload.greenFlags || '',
        funFact: payload.funFact || '',
        pictures: payload.pictures || [],
    });
    const session = await Session.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
    });

    return {
        token: session.token,
        user: publicUser(user),
    };
}

async function login(payload) {
    const user = await User.findOne({
        $or: [{ username: payload.identifier }, { email: payload.identifier }],
    });

    if (!user) {
        throw new AppError(401, 'Username/E-Mail oder Passwort ist falsch');
    }

    const passwordMatches = await verifyPassword(payload.password, user.passwordHash);

    if (!passwordMatches) {
        throw new AppError(401, 'Username/E-Mail oder Passwort ist falsch');
    }

    const session = await Session.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
    });

    return {
        token: session.token,
        user: publicUser(user),
    };
}

function getCurrentUser(authenticatedUser) {
    return publicUser(authenticatedUser);
}

module.exports = {
    register,
    login,
    getCurrentUser,
    publicUser,
};

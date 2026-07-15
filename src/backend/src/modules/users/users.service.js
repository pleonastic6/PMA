const { AppError } = require('../../common/errors/app-error');
const { publicUser } = require('../auth/auth.service');
const { User } = require('./user.model');

function getCurrentUser(user) {
    return publicUser(user);
}

async function getPublicUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, 'Benutzer nicht gefunden');
    }

    return publicUser(user);
}

async function updateCurrentUser(userId, partialUpdate) {
    const updatedUser = await User.findByIdAndUpdate(userId, partialUpdate, {
        returnDocument: 'after',
        runValidators: true,
    });

    if (!updatedUser) {
        throw new AppError(404, 'Benutzer nicht gefunden');
    }

    return publicUser(updatedUser);
}

async function updateCurrentUserPreferences(userId, partialPreferences) {
    const preferenceUpdate = Object.fromEntries(
        Object.entries(partialPreferences).map(([key, value]) => [`preferences.${key}`, value]),
    );
    const updatedUser = await User.findByIdAndUpdate(userId, preferenceUpdate, {
        returnDocument: 'after',
        runValidators: true,
    });

    if (!updatedUser) {
        throw new AppError(404, 'Benutzer nicht gefunden');
    }

    return publicUser(updatedUser);
}

module.exports = {
    getCurrentUser,
    getPublicUserById,
    updateCurrentUser,
    updateCurrentUserPreferences,
};

const { AppError } = require('../errors/app-error');
const { Session } = require('../../modules/auth/session.model');
const { User } = require('../../modules/users/user.model');

function getBearerToken(headerValue) {
    if (!headerValue || typeof headerValue !== 'string') {
        return null;
    }

    const [scheme, token] = headerValue.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return null;
    }

    return token;
}

async function requireAuth(req, res, next) {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
        next(new AppError(401, 'Authentifizierung erforderlich'));
        return;
    }

    const session = await Session.findOne({ token }).lean();

    if (!session) {
        next(new AppError(401, 'Ungueltiges oder abgelaufenes Token'));
        return;
    }

    const user = await User.findById(session.userId).lean();

    if (!user) {
        next(new AppError(401, 'Benutzer zu diesem Token existiert nicht'));
        return;
    }

    req.auth = { token, session, user };
    next();
}

module.exports = {
    requireAuth,
};

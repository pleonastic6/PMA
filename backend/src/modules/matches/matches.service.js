const { AppError } = require('../../common/errors/app-error');
const { Swipe } = require('./swipe.model');
const { User } = require('../users/user.model');
const { publicUser } = require('../auth/auth.service');

async function createSwipe(currentUserId, payload) {
    if (String(currentUserId) === String(payload.targetUserId)) {
        throw new AppError(400, 'Du kannst dich nicht selbst swipen');
    }

    const targetUser = await User.findById(payload.targetUserId);

    if (!targetUser) {
        throw new AppError(404, 'Zielprofil nicht gefunden');
    }

    const swipe = await Swipe.findOneAndUpdate(
        { swiperUserId: currentUserId, targetUserId: payload.targetUserId },
        {
            swiperUserId: currentUserId,
            targetUserId: payload.targetUserId,
            direction: payload.direction,
        },
        {
            upsert: true,
            returnDocument: 'after',
            runValidators: true,
        },
    );

    let isMatch = false;

    if (payload.direction === 'like') {
        const targetIsDemo = String(targetUser.email || '').toLowerCase().endsWith('@pma.local');

        if (targetIsDemo) {
            await Swipe.findOneAndUpdate(
                { swiperUserId: payload.targetUserId, targetUserId: currentUserId },
                {
                    swiperUserId: payload.targetUserId,
                    targetUserId: currentUserId,
                    direction: 'like',
                },
                {
                    upsert: true,
                    returnDocument: 'after',
                    runValidators: true,
                },
            );
        }

        const reciprocalSwipe = await Swipe.findOne({
            swiperUserId: payload.targetUserId,
            targetUserId: currentUserId,
            direction: 'like',
        }).lean();

        isMatch = Boolean(reciprocalSwipe);
    }

    return {
        swipeId: String(swipe._id),
        direction: swipe.direction,
        isMatch,
        targetUser: publicUser(targetUser),
    };
}

async function listMatches(currentUserId) {
    const outgoingLikes = await Swipe.find({
        swiperUserId: currentUserId,
        direction: 'like',
    }).lean();

    if (outgoingLikes.length === 0) {
        return [];
    }

    const targetUserIds = outgoingLikes.map((swipe) => swipe.targetUserId);
    const reciprocalLikes = await Swipe.find({
        swiperUserId: { $in: targetUserIds },
        targetUserId: currentUserId,
        direction: 'like',
    }).lean();

    const reciprocalIds = reciprocalLikes.map((swipe) => String(swipe.swiperUserId));

    if (reciprocalIds.length === 0) {
        return [];
    }

    const matchedUsers = await User.find({
        _id: { $in: reciprocalIds },
    }).sort({ updatedAt: -1 });

    return matchedUsers.map(publicUser);
}

module.exports = {
    createSwipe,
    listMatches,
};

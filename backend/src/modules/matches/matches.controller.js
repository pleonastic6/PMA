const { asyncHandler } = require('../../common/utils/async-handler');
const { AppError } = require('../../common/errors/app-error');
const matchesService = require('./matches.service');

const createSwipe = asyncHandler(async (req, res) => {
    const { targetUserId, direction } = req.body;

    if (!targetUserId) {
        throw new AppError(400, 'targetUserId ist erforderlich');
    }

    if (!['like', 'pass'].includes(direction)) {
        throw new AppError(400, 'direction muss like oder pass sein');
    }

    const result = await matchesService.createSwipe(req.auth.user._id, {
        targetUserId,
        direction,
    });

    res.status(200).json({
        success: true,
        data: result,
    });
});

const listMatches = asyncHandler(async (req, res) => {
    const matches = await matchesService.listMatches(req.auth.user._id);

    res.status(200).json({
        success: true,
        data: matches,
    });
});

module.exports = {
    createSwipe,
    listMatches,
};

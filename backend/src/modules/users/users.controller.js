const { asyncHandler } = require('../../common/utils/async-handler');
const {
    validatePreferencesUpdateBody,
    validateProfileUpdateBody,
} = require('../../common/validators/users.validators');
const usersService = require('./users.service');

const me = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: usersService.getCurrentUser(req.auth.user),
    });
});

const updateMe = asyncHandler(async (req, res) => {
    const payload = validateProfileUpdateBody(req.body);
    const user = await usersService.updateCurrentUser(req.auth.user._id, payload);

    res.status(200).json({
        success: true,
        data: user,
    });
});

const updatePreferences = asyncHandler(async (req, res) => {
    const payload = validatePreferencesUpdateBody(req.body);
    const user = await usersService.updateCurrentUserPreferences(req.auth.user._id, payload);

    res.status(200).json({
        success: true,
        data: user,
    });
});

module.exports = {
    me,
    updateMe,
    updatePreferences,
};

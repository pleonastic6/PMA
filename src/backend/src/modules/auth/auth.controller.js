const { asyncHandler } = require('../../common/utils/async-handler');
const { validateLoginBody, validateRegisterBody } = require('../../common/validators/auth.validators');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
    const payload = validateRegisterBody(req.body);
    const result = await authService.register(payload);

    res.status(201).json({
        success: true,
        data: result,
    });
});

const login = asyncHandler(async (req, res) => {
    const payload = validateLoginBody(req.body);
    const result = await authService.login(payload);

    res.status(200).json({
        success: true,
        data: result,
    });
});

const me = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: authService.getCurrentUser(req.auth.user),
    });
});

module.exports = {
    register,
    login,
    me,
};

const { asyncHandler } = require('../../common/utils/async-handler');
const discoveryService = require('./discovery.service');

const listCandidates = asyncHandler(async (req, res) => {
    const candidates = await discoveryService.listCandidates(req.auth.user._id);

    res.status(200).json({
        success: true,
        data: candidates,
    });
});

module.exports = {
    listCandidates,
};

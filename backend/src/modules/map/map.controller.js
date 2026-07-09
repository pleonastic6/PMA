const { asyncHandler } = require('../../common/utils/async-handler');
const mapService = require('./map.service');

const overview = asyncHandler(async (req, res) => {
    const data = await mapService.getMapOverview(req.auth.user);

    res.status(200).json({
        success: true,
        data,
    });
});

module.exports = {
    overview,
};

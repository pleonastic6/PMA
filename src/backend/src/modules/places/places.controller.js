const { asyncHandler } = require('../../common/utils/async-handler');
const placesService = require('./places.service');

const searchPlaces = asyncHandler(async (req, res) => {
    const results = await placesService.searchPlaces(req.query.q, {
        mode: req.query.mode,
    });

    res.status(200).json({
        success: true,
        data: results,
    });
});

module.exports = {
    searchPlaces,
};

const { asyncHandler } = require('../../common/utils/async-handler');
const { validateCreateEventBody } = require('../../common/validators/events.validators');
const eventsService = require('./events.service');

const listEvents = asyncHandler(async (req, res) => {
    const events = await eventsService.listEvents();

    res.status(200).json({
        success: true,
        data: events,
    });
});

const createEvent = asyncHandler(async (req, res) => {
    const payload = validateCreateEventBody(req.body);
    const event = await eventsService.createEvent(req.auth.user, payload);

    res.status(201).json({
        success: true,
        data: event,
    });
});

module.exports = {
    listEvents,
    createEvent,
};

const { asyncHandler } = require('../../common/utils/async-handler');
const { validateCreateEventBody, validateUpdateEventBody } = require('../../common/validators/events.validators');
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

const getEvent = asyncHandler(async (req, res) => {
    const event = await eventsService.getEventById(req.params.eventId);

    res.status(200).json({
        success: true,
        data: event,
    });
});

const updateEvent = asyncHandler(async (req, res) => {
    const payload = validateUpdateEventBody(req.body);
    const event = await eventsService.updateEvent(req.auth.user, req.params.eventId, payload);

    res.status(200).json({
        success: true,
        data: event,
    });
});

const deleteEvent = asyncHandler(async (req, res) => {
    await eventsService.deleteEvent(req.auth.user, req.params.eventId);

    res.status(200).json({
        success: true,
        data: { id: req.params.eventId },
    });
});

module.exports = {
    listEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
};

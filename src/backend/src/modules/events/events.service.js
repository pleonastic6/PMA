const { Event } = require('./event.model');
const { User } = require('../users/user.model');
const { seededPosition } = require('../../common/utils/demo-geo');
const { AppError } = require('../../common/errors/app-error');

function toEventDto(event, creator) {
    return {
        id: String(event._id),
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        locationName: event.locationName,
        category: event.category,
        position: event.position,
        creator: creator
            ? {
                  id: String(creator._id),
                  username: creator.username,
                  displayName: creator.displayName || creator.firstName || creator.username,
              }
            : null,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
    };
}

async function listEvents() {
    const events = await Event.find({}).sort({ date: 1, time: 1, createdAt: -1 }).lean();

    if (events.length === 0) {
        return [];
    }

    const creatorIds = [...new Set(events.map((event) => String(event.creatorUserId)))];
    const creators = await User.find({ _id: { $in: creatorIds } }).lean();
    const creatorById = new Map(creators.map((creator) => [String(creator._id), creator]));

    return events.map((event) => {
        const creator = creatorById.get(String(event.creatorUserId));
        return toEventDto(event, creator);
    });
}

async function getEventById(eventId) {
    const event = await Event.findById(eventId).lean();

    if (!event) {
        throw new AppError(404, 'Event nicht gefunden');
    }

    const creator = await User.findById(event.creatorUserId).lean();
    return toEventDto(event, creator);
}

async function createEvent(currentUser, payload) {
    const seeded = seededPosition(
        `${payload.locationName}:${payload.title}:${currentUser._id}`,
    );

    const event = await Event.create({
        ...payload,
        position: payload.position || seeded,
        creatorUserId: currentUser._id,
    });

    return toEventDto(event, currentUser);
}

async function updateEvent(currentUser, eventId, payload) {
    const existingEvent = await Event.findById(eventId);

    if (!existingEvent) {
        throw new AppError(404, 'Event nicht gefunden');
    }

    if (String(existingEvent.creatorUserId) !== String(currentUser._id)) {
        throw new AppError(403, 'Du kannst nur deine eigenen Events bearbeiten');
    }

    const nextPosition =
        payload.position ||
        (Array.isArray(existingEvent.position) && existingEvent.position.length === 2
            ? existingEvent.position
            : seededPosition(`${payload.locationName}:${payload.title}:${currentUser._id}`));

    existingEvent.title = payload.title;
    existingEvent.description = payload.description;
    existingEvent.date = payload.date;
    existingEvent.time = payload.time;
    existingEvent.locationName = payload.locationName;
    existingEvent.category = payload.category;
    existingEvent.position = nextPosition;

    await existingEvent.save();

    return toEventDto(existingEvent.toObject(), currentUser);
}

async function deleteEvent(currentUser, eventId) {
    const event = await Event.findById(eventId);

    if (!event) {
        throw new AppError(404, 'Event nicht gefunden');
    }

    if (String(event.creatorUserId) !== String(currentUser._id)) {
        throw new AppError(403, 'Du kannst nur deine eigenen Events loeschen');
    }

    await event.deleteOne();
}

module.exports = {
    listEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};

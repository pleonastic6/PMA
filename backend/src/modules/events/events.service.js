const { Event } = require('./event.model');
const { User } = require('../users/user.model');
const { publicUser } = require('../auth/auth.service');
const { seededPosition } = require('../../common/utils/demo-geo');

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

module.exports = {
    listEvents,
    createEvent,
};

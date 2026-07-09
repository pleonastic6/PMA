const { User } = require('../users/user.model');
const eventsService = require('../events/events.service');
const { DEFAULT_MAP_CENTER, seededPosition } = require('../../common/utils/demo-geo');

async function getMapOverview(currentUser) {
    const [events, users] = await Promise.all([
        eventsService.listEvents(),
        User.find({
            _id: { $ne: currentUser._id },
            meetupStatus: { $ne: 'hidden' },
        })
            .sort({ updatedAt: -1 })
            .limit(30)
            .lean(),
    ]);

    return {
        center: DEFAULT_MAP_CENTER,
        events: events.map((event) => ({
            id: event.id,
            position: event.position,
            name: event.title,
            description: `${event.category} · ${event.locationName}`,
        })),
        users: users.map((user) => ({
            id: String(user._id),
            center: seededPosition(`user:${user._id}`),
            radius: 220 + (String(user._id).charCodeAt(0) % 5) * 60,
            name: user.displayName || user.firstName || user.username,
            color: '#574EFF',
        })),
    };
}

module.exports = {
    getMapOverview,
};

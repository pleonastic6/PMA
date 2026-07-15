const eventsService = require('../events/events.service');
const { DEFAULT_MAP_CENTER } = require('../../common/utils/demo-geo');

async function getMapOverview(currentUser) {
    const events = await eventsService.listEvents();

    return {
        center: DEFAULT_MAP_CENTER,
        events: events.map((event) => ({
            id: event.id,
            position: event.position,
            name: event.title,
            description: `${event.category} · ${event.locationName}`,
        })),
        users: [],
    };
}

module.exports = {
    getMapOverview,
};

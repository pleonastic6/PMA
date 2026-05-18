import INITIAL_EVENTS from '../data/events.json';

const STORAGE_KEY = 'app_events_v5';

export const eventService = {
  getEvents: () => {
    try {
      const eventsJson = localStorage.getItem(STORAGE_KEY);
      if (eventsJson) {
        return JSON.parse(eventsJson);
      } else {
        // Initialize with dummy data if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
      }
    } catch (error) {
      console.error("Error reading events from localStorage", error);
      return [];
    }
  },

  createEvent: (eventData) => {
    try {
      const events = eventService.getEvents();
      const newEvent = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedEvents = [...events, newEvent];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      return newEvent;
    } catch (error) {
      console.error("Error saving event to localStorage", error);
      return null;
    }
  }
};

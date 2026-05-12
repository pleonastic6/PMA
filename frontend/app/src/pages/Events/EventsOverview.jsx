import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import MapWidget from '../../components/Map/MapWidget';
import { Calendar, MapPin, Clock, Plus, List, Map as MapIcon, User } from 'lucide-react';

export default function EventsOverview() {
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const navigate = useNavigate();

  useEffect(() => {
    const loadedEvents = eventService.getEvents();
    setEvents(loadedEvents);
  }, []);

  const mapLocations = events.map(event => ({
    position: event.position || [49.444, 11.848],
    name: event.title,
    description: event.description
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events Übersicht</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Entdecke spannende Events in deiner Umgebung.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <List size={18} />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <MapIcon size={18} />
              <span className="hidden sm:inline">Karte</span>
            </button>
          </div>
          <button
            onClick={() => navigate('/events/create')}
            className="flex items-center gap-2 bg-[#574EFF] hover:bg-[#4940F4] text-white px-5 py-2.5 rounded-lg transition-colors font-medium ml-auto md:ml-0 shadow-lg shadow-indigo-500/30"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Event erstellen</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg">Keine Events gefunden.</p>
              <button onClick={() => navigate('/events/create')} className="text-indigo-600 hover:underline mt-2">Erstelle das erste Event!</button>
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="bg-white dark:bg-[#1A1C1E] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {event.category || 'Event'}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md">
                    <User size={14} />
                    <span>{event.creator || 'Anonym'}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 z-10 relative">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm flex-grow z-10 relative">{event.description}</p>
                
                <div className="space-y-3 mt-auto pt-4 border-t border-gray-100 dark:border-white/5 z-10 relative">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Calendar size={16} />
                    </div>
                    <span>{new Date(event.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                      <Clock size={16} />
                    </div>
                    <span>{event.time} Uhr</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                      <MapPin size={16} />
                    </div>
                    <span className="line-clamp-1">{event.locationName}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 relative z-0">
          <MapWidget locations={mapLocations} zoom={14} center={events.length > 0 && events[0].position ? events[0].position : [49.444, 11.848]} />
        </div>
      )}
    </div>
  );
}

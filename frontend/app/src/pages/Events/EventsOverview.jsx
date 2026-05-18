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
        <div className="space-y-8">
          {events.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
              <p className="text-xl font-medium mb-4">Keine Events gefunden.</p>
              <button onClick={() => navigate('/events/create')} className="bg-[#574EFF] text-white px-6 py-3 rounded-xl hover:bg-[#4940F4] transition-colors font-medium">
                Erstelle das erste Event!
              </button>
            </div>
          ) : (
            <>
              {/* Featured Event (First Item) */}
              <div key={events[0].id} className="bg-white dark:bg-[#1A1C1E] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col lg:flex-row group relative transition-transform duration-500 hover:shadow-indigo-500/10">
                {/* Abstract Image Placeholder for Featured */}
                <div 
                  className="lg:w-2/5 h-72 lg:h-auto relative overflow-hidden bg-gray-900"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                   <div className="absolute bottom-8 left-8 text-white pr-8">
                      <span className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block shadow-lg">
                        ✨ Highlight
                      </span>
                      <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md">{events[0].title}</h2>
                   </div>
                </div>
                
                {/* Content for Featured */}
                <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-between relative bg-white dark:bg-[#1A1C1E]">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none"></div>
                   
                   <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                          {events[0].category || 'Event'}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-4 py-1.5 rounded-full border border-gray-100 dark:border-white/5 shadow-inner">
                          <User size={16} />
                          <span className="font-medium">{events[0].creator || 'Anonym'}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-10 leading-relaxed font-medium">{events[0].description}</p>
                      
                      <div className="flex flex-wrap gap-x-8 gap-y-6 mb-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-500/20">
                            <Calendar size={22} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5">Datum</p>
                            <p className="font-bold text-gray-900 dark:text-white">{new Date(events[0].date).toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-500/20">
                            <Clock size={22} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5">Zeit</p>
                            <p className="font-bold text-gray-900 dark:text-white">{events[0].time} Uhr</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm border border-green-100 dark:border-green-500/20">
                            <MapPin size={22} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5">Ort</p>
                            <p className="font-bold text-gray-900 dark:text-white">{events[0].locationName}</p>
                          </div>
                        </div>
                      </div>
                   </div>
                   
                   <button 
                      onClick={() => navigate('/events/' + events[0].id)}
                      className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-gray-900/20 dark:shadow-white/10">
                      Details ansehen
                   </button>
                </div>
              </div>

              {/* Regular Events (Wide Cards) */}
              {events.length > 1 && (
                <div className="mt-16">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Weitere Events entdecken</h3>
                    <div className="h-px bg-gray-200 dark:bg-white/10 flex-grow ml-6"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {events.slice(1).map((event, idx) => (
                      <div 
                        key={event.id} 
                        onClick={() => navigate('/events/' + event.id)}
                        className="cursor-pointer bg-white dark:bg-[#1A1C1E] border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 group"
                      >
                        {/* Abstract Color Block Thumbnail */}
                        <div className={`w-full sm:w-32 h-40 sm:h-auto rounded-xl flex-shrink-0 bg-gradient-to-br ${
                          idx % 4 === 0 ? 'from-pink-500 to-rose-400' : 
                          idx % 4 === 1 ? 'from-emerald-400 to-teal-500' : 
                          idx % 4 === 2 ? 'from-amber-400 to-orange-500' :
                          'from-violet-500 to-fuchsia-500'
                        } relative overflow-hidden shadow-inner flex flex-col items-center justify-center text-white`}>
                           <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <span className="text-3xl font-black opacity-80">{new Date(event.date).getDate()}</span>
                           <span className="text-sm font-bold uppercase tracking-widest opacity-80">{new Date(event.date).toLocaleDateString('de-DE', { month: 'short' })}</span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded text-[10px]">{event.category || 'Event'}</span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                          <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">{event.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500 mt-auto">
                             <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md"><Clock size={14} className="text-gray-400"/> {event.time}</span>
                             <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md truncate max-w-[150px]"><MapPin size={14} className="text-gray-400"/> {event.locationName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
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

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plus, User, Pencil, Trash2, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EVENT_CATEGORIES = ['Alle', 'Party', 'Quiz', 'Treffen', 'Sport', 'Kultur', 'Sonstiges'];

function getCreatorLabel(creator) {
  if (!creator) {
    return 'Anonym';
  }

  if (typeof creator === 'string') {
    return creator;
  }

  if (typeof creator === 'object') {
    return creator.displayName || creator.username || creator.id || 'Anonym';
  }

  return 'Anonym';
}

export default function EventsOverview() {
  const { deleteEvent, getEvents, isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    date: '',
    category: 'Alle',
  });
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    getEvents()
      .then((loadedEvents) => {
        if (active) {
          setEvents(loadedEvents);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, getEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = !filters.search || `${event.title} ${event.description}`.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation = !filters.location || event.locationName.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDate = !filters.date || event.date === filters.date;
      const matchesCategory = filters.category === 'Alle' || event.category === filters.category;

      return matchesSearch && matchesLocation && matchesDate && matchesCategory;
    });
  }, [events, filters]);

  const hasActiveFilters = Boolean(filters.search || filters.location || filters.date || filters.category !== 'Alle');

  async function handleDelete(eventId) {
    const confirmed = window.confirm('Event wirklich loeschen?');
    if (!confirmed) {
      return;
    }

    setDeletingId(eventId);
    setError('');

    try {
      await deleteEvent(eventId);
      setEvents((current) => current.filter((entry) => entry.id !== eventId));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId('');
    }
  }

  function resetFilters() {
    setFilters({
      search: '',
      location: '',
      date: '',
      category: 'Alle',
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Nur noch Listenmodus. Karte lebt jetzt sauber im Map-Reiter.</p>
        </div>

        <button
          onClick={() => navigate('/events/create')}
          className="flex items-center gap-2 bg-[#574EFF] hover:bg-[#4940F4] text-white px-5 py-2.5 rounded-lg transition-colors font-medium ml-auto md:ml-0 shadow-lg shadow-indigo-500/30"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Event erstellen</span>
        </button>
      </div>

      <div className="mb-8 rounded-[1.75rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1C1E] p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_220px_220px_auto] gap-3">
          <label className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Nach Titel oder Beschreibung suchen"
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 pl-11 pr-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}
            placeholder="Ort filtern"
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={filters.date}
            onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filters.category}
            onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 px-4 py-3 font-semibold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            <X size={16} />
            Reset
          </button>
        </div>
      </div>

      {error ? <p className="mb-6 text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">Events werden geladen...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg">Keine Events passend zu den Filtern.</p>
              <button onClick={resetFilters} className="text-indigo-600 hover:underline mt-2">Filter zuruecksetzen</button>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isOwner = String(event.creator?.id) === String(user?.id);

              return (
                <div key={event.id} className="bg-white dark:bg-[#1A1C1E] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                  <div className="flex justify-between items-start mb-4 gap-3">
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {event.category || 'Event'}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md">
                      <User size={14} />
                      <span>{getCreatorLabel(event.creator)}</span>
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

                  {isOwner ? (
                    <div className="mt-5 flex gap-3 z-10 relative">
                      <button
                        type="button"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 dark:border-stone-700 px-4 py-3 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      >
                        <Pencil size={16} />
                        Bearbeiten
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 text-red-600 dark:border-red-900/40 dark:text-red-300 px-4 py-3 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition disabled:opacity-60"
                      >
                        <Trash2 size={16} />
                        {deletingId === event.id ? 'Loesche...' : 'Loeschen'}
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

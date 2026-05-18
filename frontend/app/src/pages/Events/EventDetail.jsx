import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import MapWidget from '../../components/Map/MapWidget';
import { Calendar, Clock, MapPin, ArrowLeft, User, Users, MessageSquare, Check, Share2, Plus } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isAttending, setIsAttending] = useState(false);
  const [participantCount, setParticipantCount] = useState(Math.floor(Math.random() * 20) + 3);

  useEffect(() => {
    const allEvents = eventService.getEvents();
    const foundEvent = allEvents.find(e => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  const handleAttend = () => {
    setIsAttending(!isAttending);
    setParticipantCount(prev => isAttending ? prev - 1 : prev + 1);
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Event wird geladen oder nicht gefunden...</h2>
        <button onClick={() => navigate('/events')} className="mt-6 text-indigo-600 hover:underline">Zurück zur Übersicht</button>
      </div>
    );
  }

  // Fallback to Amberg coordinates if none provided
  const position = event.position || [49.444, 11.848];
  
  const mapLocations = [{
    position: position,
    name: event.title,
    description: event.description
  }];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101010] pb-20">
      
      {/* Back Button outside Hero */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <button 
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span>Zurück zur Übersicht</span>
        </button>
      </div>

      {/* Hero Header */}
      <div 
        className="w-full h-[30vh] md:h-[35vh] relative overflow-hidden flex items-end pb-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>

        {/* Header Content */}
        <div className="container mx-auto px-4 relative z-10 w-full max-w-6xl flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block shadow-lg">
              {event.category || 'Event'}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md mb-2">{event.title}</h1>
            <div className="flex items-center gap-3 text-white/90">
              <User size={18} />
              <span>Veranstaltet von <strong className="text-white">{event.creator || 'Anonym'}</strong></span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-xl transition-all font-semibold">
              <Share2 size={20} />
              Teilen
            </button>
            <button 
              onClick={handleAttend}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold shadow-xl transition-all duration-300 ${isAttending ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' : 'bg-white text-indigo-600 hover:scale-105 shadow-white/10'}`}
            >
              {isAttending ? <Check size={20} /> : <Plus size={20} />}
              {isAttending ? 'Ich bin dabei!' : 'Teilnehmen'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 mt-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Details) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Info Bar */}
          <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/5 flex flex-wrap md:flex-nowrap gap-6 md:gap-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Datum</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{new Date(event.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'long' })}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Clock size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Uhrzeit</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{event.time} Uhr</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Users size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Zusagen</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{participantCount} Personen</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Über das Event</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              <p>{event.description}</p>
            </div>
          </div>

          {/* Comments Section (Mock) */}
          <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="text-indigo-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Diskussion</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                  M
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none w-full border border-gray-100 dark:border-white/5">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Max Mustermann</span>
                    <span className="text-xs text-gray-400">Gestern</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Gibt es vor Ort auch vegetarische Optionen?</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#574EFF] flex items-center justify-center font-bold text-white shrink-0">
                  {event.creator ? event.creator.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl rounded-tl-none w-full border border-indigo-100 dark:border-indigo-500/20">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">{event.creator} <span className="bg-indigo-200 dark:bg-indigo-800 text-[10px] px-1.5 py-0.5 rounded text-indigo-800 dark:text-indigo-200 ml-1">Veranstalter</span></span>
                    <span className="text-xs text-indigo-400">Heute</span>
                  </div>
                  <p className="text-sm text-indigo-900 dark:text-indigo-100">Ja klar, es wird für alle etwas dabei sein!</p>
                </div>
              </div>
            </div>

            {/* Input field */}
            <div className="mt-8 relative">
              <input 
                type="text" 
                placeholder="Schreibe einen Kommentar..." 
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-full py-4 pl-6 pr-16 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-[#574EFF] text-white px-4 rounded-full font-medium hover:bg-[#4940F4] transition-colors">
                Senden
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar & Map) */}
        <div className="space-y-8">
          
          {/* Map Card */}
          <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="text-green-500" size={20} />
              Standort
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">{event.locationName}</p>
            
            <div className="h-64 rounded-2xl overflow-hidden relative z-0 border border-gray-200 dark:border-white/10 mb-4">
              <MapWidget locations={mapLocations} zoom={15} center={position} />
            </div>
            
            <button className="w-full py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors">
              Route in Maps öffnen
            </button>
          </div>

          {/* Quick Actions / Share */}
          <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Aktionen</h3>
             <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-left group">
                 <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Zum Kalender hinzufügen</span>
                 <Calendar className="text-gray-400 group-hover:text-indigo-500" size={18} />
               </button>
               <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-left group">
                 <span className="font-medium text-red-600 dark:text-red-400">Event melden</span>
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

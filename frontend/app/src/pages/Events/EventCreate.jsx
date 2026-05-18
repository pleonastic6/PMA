import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { Calendar, Clock, MapPin, AlignLeft, Type, Tag, ArrowLeft, CheckCircle2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPickerMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function EventCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // State for map coordinates (Amberg Center Default)
  const [pickedPosition, setPickedPosition] = useState([49.444, 11.848]);

  useEffect(() => {
    // Auth Check: Look for a token or user object in localStorage
    const user = localStorage.getItem('user') || localStorage.getItem('token');
    if (!user) {
       setIsLoggedIn(false);
    }
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    locationName: '',
    category: 'Party'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hilfs-Funktion für den Prototyp, um Login zu simulieren
  const handleMockLogin = () => {
    localStorage.setItem('user', JSON.stringify({ name: 'TestUser' }));
    setIsLoggedIn(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Build the event object
      const newEvent = {
        ...formData,
        position: pickedPosition,
        // Hole den echten User-Namen oder fallback
        creator: JSON.parse(localStorage.getItem('user'))?.name || 'Current User'
      };
      
      eventService.createEvent(newEvent);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    }, 800);
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white dark:bg-[#1A1C1E] p-10 rounded-3xl shadow-xl flex flex-col items-center max-w-md w-full text-center border border-red-100 dark:border-red-900/30">
          <AlertCircle size={56} className="text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Zugriff verweigert</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Du musst angemeldet sein, um ein neues Event erstellen zu können.</p>
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => navigate('/Login')} className="w-full bg-[#574EFF] text-white py-3.5 rounded-xl hover:bg-[#4940F4] shadow-lg transition-colors font-bold">Zum Login</button>
            <button onClick={handleMockLogin} className="w-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors font-medium">Bypass: Test-Login ausführen</button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white dark:bg-[#1A1C1E] p-10 rounded-3xl shadow-xl flex flex-col items-center max-w-md w-full text-center border border-green-100 dark:border-green-900/30">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Event erstellt!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Dein Event wurde erfolgreich gespeichert und ist nun für andere sichtbar.</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-[progress_2s_ease-in-out]" style={{animationDuration: '2s', animationName: 'progress'}}></div>
          </div>
          <style>{`
            @keyframes progress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Zurück zur Übersicht</span>
      </button>

      <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#574EFF] to-[#7B7DFF] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold relative z-10 mb-2">Neues Event erstellen</h1>
          <p className="text-white font-medium relative z-10 text-lg drop-shadow-sm">Teile dein Vorhaben mit der Community</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          
          {/* Titel & Kategorie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Type size={16} className="text-indigo-500" />
                Titel des Events <span className="text-red-500">*</span>
              </label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="z.B. Kneipenquiz, WG-Party..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Tag size={16} className="text-orange-500" />
                Kategorie <span className="text-red-500">*</span>
              </label>
              <select 
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
              >
                <option className="bg-white text-gray-900 dark:bg-[#1A1C1E] dark:text-white" value="Party">Party</option>
                <option className="bg-white text-gray-900 dark:bg-[#1A1C1E] dark:text-white" value="Quiz">Quiz</option>
                <option className="bg-white text-gray-900 dark:bg-[#1A1C1E] dark:text-white" value="Treffen">Treffen</option>
                <option className="bg-white text-gray-900 dark:bg-[#1A1C1E] dark:text-white" value="Sport">Sport</option>
                <option className="bg-white text-gray-900 dark:bg-[#1A1C1E] dark:text-white" value="Kultur">Kultur</option>
                <option className="bg-white text-gray-900 dark:bg-[#1A1C1E] dark:text-white" value="Sonstiges">Sonstiges</option>
              </select>
            </div>
          </div>

          {/* Datum & Zeit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                Datum <span className="text-red-500">*</span>
              </label>
              <input 
                required
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock size={16} className="text-purple-500" />
                Uhrzeit <span className="text-red-500">*</span>
              </label>
              <input 
                required
                type="time" 
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer"
              />
            </div>
          </div>

          <hr className="border-gray-100 dark:border-white/5" />

          {/* Map Picker & Location Name */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin size={16} className="text-green-500" />
                Name der Location <span className="text-red-500">*</span>
              </label>
              <input 
                required
                type="text" 
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="z.B. Stadtpark, Blaues Haus..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                Genauen Standort auf der Karte markieren <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Klicke auf die Karte, um den exakten Ort festzulegen.</p>
              <div className="h-[300px] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 relative z-0">
                <MapContainer center={pickedPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPickerMarker position={pickedPosition} setPosition={setPickedPosition} />
                </MapContainer>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-white/5" />

          {/* Description */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <AlignLeft size={16} className="text-pink-500" />
                Beschreibung <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea 
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Worum geht es? Was sollte man mitbringen? Alle wichtigen Details hier rein." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-white/5">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed shadow-none' : 'bg-[#574EFF] hover:bg-[#4940F4] hover:shadow-indigo-500/30 hover:-translate-y-1'}`}
            >
              {isSubmitting ? 'Event wird erstellt...' : 'Event jetzt veröffentlichen'}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">Felder mit einem <span className="text-red-500">*</span> sind Pflichtfelder.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, AlignLeft, Type, Tag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function EventCreate() {
  const navigate = useNavigate();
  const { createEvent } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await createEvent(formData);
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (submitError) {
      setError(submitError.message);
      setIsSubmitting(false);
    }
  };

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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Zurück zur Übersicht</span>
      </button>

      <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#574EFF] to-[#7B7DFF] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <h1 className="text-3xl font-bold relative z-10">Neues Event erstellen</h1>
          <p className="mt-2 text-indigo-100 relative z-10">Teile dein Vorhaben mit der Community</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Type size={16} className="text-indigo-500" />
              Titel des Events
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                Datum
              </label>
              <input 
                required
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock size={16} className="text-purple-500" />
                Uhrzeit
              </label>
              <input 
                required
                type="time" 
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin size={16} className="text-green-500" />
                Ort / Location
              </label>
              <input 
                required
                type="text" 
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="Name der Bar, Adresse etc." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Tag size={16} className="text-orange-500" />
                Kategorie
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlignLeft size={16} className="text-pink-500" />
              Beschreibung
            </label>
            <textarea 
              required
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Worum geht es? Was sollte man mitbringen?" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-[#574EFF] hover:bg-[#4940F4] hover:shadow-indigo-500/30'}`}
            >
              {isSubmitting ? 'Event wird erstellt...' : 'Event erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

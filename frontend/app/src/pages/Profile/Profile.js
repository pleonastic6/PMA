import { useState } from "react";
import ModernInput from "../../components/form_elements/ModernInput";
import img_beispielbild from "../../assets/images/Beispielbild.png";

export default function EditProfile() {
    const [interests, setInterests] = useState(['Wandern', 'Kaffee trinken', 'Gaming', 'Sport', 'Kochen']);
    const [languages, setLanguages] = useState(['Deutsch', 'Englisch']);
    const [age, setAge] = useState(18);

    return (
        /* Nutzt globale body-Farben aus index.css */
        <main className="min-h-screen flex justify-center items-center p-4 md:p-10 transition-colors duration-300">
            
            {/* Card: Nutzt dein dunkles Anthrazit für den Dark Mode, um sich vom Nachtblau-Hintergrund abzuheben */}
            <div className="w-full max-w-4xl bg-white dark:bg-[#1c1917] rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-14 border border-stone-200 dark:border-stone-800 transition-all">
                
                <header className="mb-10">
                    {/* h1 nutzt jetzt deine CSS-Farbe (black/70 oder #abb5d2) */}
                    <h1 className="font-extrabold tracking-tight">
                        Profil bearbeiten
                    </h1>
                    <div className="w-16 h-1.5 bg-[#af6aff] rounded-full mt-3 shadow-[0_0_15px_rgba(175,106,255,0.4)]" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Linke Seite: Bild & Status */}
                    <div className="lg:col-span-4 flex flex-col items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-1.5 bg-[#af6aff] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <img 
                                src={img_beispielbild} 
                                className="relative w-48 h-48 rounded-[1.8rem] object-cover border-2 border-stone-100 dark:border-stone-700 shadow-xl" 
                                alt="Profil"
                            />
                            <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-[1.8rem] text-white font-semibold cursor-pointer">
                                Ändern
                            </button>
                        </div>
                        <div className="px-5 py-2 bg-green-50 dark:bg-[#dcfce7]/10 rounded-full border border-green-200 dark:border-green-900/30">
                            {/* Status nutzt eine eigene kleine Farbe für Kontrast */}
                            <span className="text-green-700 dark:text-[#15803d] text-xs font-black uppercase tracking-widest">Aktiv für Treffen</span>
                        </div>
                    </div>

                    {/* Rechte Seite: Formular */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        
                        {/* Basis Infos: Labels nutzen jetzt deine CSS-Farben */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-bold ml-1">Anzeigename</label>
                                <ModernInput placeholder="Wie sollen dich andere nennen?" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold ml-1">Wohnort</label>
                                <ModernInput placeholder="In welcher Stadt bist du?" />
                            </div>
                        </div>

                        {/* ALTER SEKTION: Card-in-Card für Tiefe */}
                        <div className="flex flex-col gap-5 p-6 bg-stone-50 dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-inner">
                            <div className="flex justify-between items-center">
                                <label className="font-bold ml-1">Dein Alter</label>
                                <span className="text-[#af6aff] font-extrabold text-2xl bg-[#af6aff]/10 px-4 py-2 rounded-xl border border-[#af6aff]/20">
                                    {age} Jahre
                                </span>
                            </div>
                            <input 
                                type="range" min="18" max="99" value={age} 
                                onChange={(e) => setAge(parseInt(e.target.value))}
                                className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#af6aff]"
                            />
                        </div>

                        {/* EISBRECHER: Nutzt <p> aus deiner CSS */}
                        <div className="flex flex-col gap-4">
                            <label className="font-bold ml-1">⚡️ Eisbrecher</label>
                            <div className="space-y-4">
                                <div className="bg-stone-50 dark:bg-[#292524] p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                                    <p className="text-xs font-bold text-[#af6aff] uppercase mb-1">Mein perfekter Tag...</p>
                                    <input className="bg-transparent w-full outline-none placeholder-stone-400" placeholder="...startet mit Kaffee." />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col gap-2">
                            <label className="font-bold ml-1">Über mich (Bio)</label>
                            <textarea 
                                className="w-full p-5 rounded-2xl bg-stone-50 dark:bg-[#292524] border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-[#af6aff] transition-all min-h-[120px] resize-none placeholder-stone-400"
                                placeholder="Erzähl kurz, was du gerne machst..."
                            />
                        </div>

                        {/* SPRACHEN & INTERESSEN */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-3">
                                <label className="font-bold ml-1">Sprachen</label>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang) => (
                                        <span key={lang} className="px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-sm border border-stone-200 dark:border-stone-700">
                                            🌐 {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="font-bold ml-1">Interessen & Aktivitäten</label>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((tag) => (
                                        <span key={tag} className="px-4 py-2 bg-stone-100 dark:bg-[#292524] border border-stone-200 dark:border-stone-700 rounded-xl text-sm flex items-center gap-2">
                                            {tag} <button className="hover:text-red-500 transition-colors">✕</button>
                                        </span>
                                    ))}
                                    <button className="px-4 py-2 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl text-sm text-stone-500 hover:border-[#af6aff] hover:text-[#af6aff] transition-all font-medium">
                                        + Hinzufügen
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button className="flex-[2] py-4 bg-[#af6aff] hover:bg-[#9e59eb] text-white font-black rounded-2xl shadow-lg transition-all hover:-translate-y-1 active:scale-95">
                                Speichern
                            </button>
                            <button type="button" className="flex-1 py-4 bg-stone-100 dark:bg-[#292524] border border-stone-200 dark:border-stone-700 font-bold rounded-2xl hover:bg-stone-200 dark:hover:bg-stone-700 transition active:scale-95">
                                Abbruch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
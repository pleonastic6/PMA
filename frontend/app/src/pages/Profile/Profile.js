import { useEffect, useState } from "react";
import ModernInput from "../../components/form_elements/ModernInput";
import img_beispielbild from "../../assets/images/Beispielbild.png";
import { useAuth } from "../../context/AuthContext";

function toCsv(values) {
  return Array.isArray(values) ? values.join(", ") : "";
}

export default function EditProfile() {
  const { user, loading, refreshProfile, updateProfile } = useAuth();
  const [form, setForm] = useState({
    displayName: "",
    location: "",
    icebreaker: "",
    bio: "",
    languages: "",
    interests: "",
  });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      refreshProfile().catch(() => null);
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      displayName: user.displayName || user.firstName || "",
      location: user.location || "",
      icebreaker: user.icebreaker || "",
      bio: user.bio || "",
      languages: toCsv(user.languages),
      interests: toCsv(user.interests),
    });
  }, [user]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      await updateProfile({
        displayName: form.displayName,
        location: form.location,
        icebreaker: form.icebreaker,
        bio: form.bio,
        languages: form.languages.split(",").map((entry) => entry.trim()).filter(Boolean),
        interests: form.interests.split(",").map((entry) => entry.trim()).filter(Boolean),
      });
      setStatus("Profil gespeichert.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && !user) {
    return <main className="min-h-screen flex items-center justify-center">Profil wird geladen...</main>;
  }

  return (
    <main className="min-h-screen flex justify-center items-center p-4 md:p-10 transition-colors duration-300">
      <form className="w-full max-w-4xl bg-white dark:bg-[#1c1917] rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-14 border border-stone-200 dark:border-stone-800 transition-all" onSubmit={handleSubmit}>
        <header className="mb-10">
          <h1 className="font-extrabold tracking-tight">Profil bearbeiten</h1>
          <div className="w-16 h-1.5 bg-[#af6aff] rounded-full mt-3 shadow-[0_0_15px_rgba(175,106,255,0.4)]" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-[#af6aff] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <img src={img_beispielbild} className="relative w-48 h-48 rounded-[1.8rem] object-cover border-2 border-stone-100 dark:border-stone-700 shadow-xl" alt="Profil" />
            </div>
            <div className="px-5 py-2 bg-green-50 dark:bg-[#dcfce7]/10 rounded-full border border-green-200 dark:border-green-900/30">
              <span className="text-green-700 dark:text-[#15803d] text-xs font-black uppercase tracking-widest">
                {user?.meetupStatus === "active" ? "Aktiv für Treffen" : "Nicht aktiv"}
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold ml-1">Anzeigename</label>
                <ModernInput placeholder="Wie sollen dich andere nennen?" value={form.displayName} onChange={(e) => updateField("displayName", e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold ml-1">Wohnort</label>
                <ModernInput placeholder="In welcher Stadt bist du?" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-bold ml-1">⚡️ Eisbrecher</label>
              <div className="space-y-4">
                <div className="bg-stone-50 dark:bg-[#292524] p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <p className="text-xs font-bold text-[#af6aff] uppercase mb-1">Mein perfekter Tag...</p>
                  <input
                    className="bg-transparent w-full outline-none placeholder-stone-400"
                    placeholder="...startet mit Kaffee."
                    value={form.icebreaker}
                    onChange={(e) => updateField("icebreaker", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold ml-1">Über mich (Bio)</label>
              <textarea
                className="w-full p-5 rounded-2xl bg-stone-50 dark:bg-[#292524] border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-[#af6aff] transition-all min-h-[120px] resize-none placeholder-stone-400"
                placeholder="Erzähl kurz, was du gerne machst..."
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
              />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="font-bold ml-1">Sprachen</label>
                <ModernInput placeholder="Deutsch, Englisch" value={form.languages} onChange={(e) => updateField("languages", e.target.value)} />
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold ml-1">Interessen & Aktivitäten</label>
                <ModernInput placeholder="Gaming, Kaffee, Sport" value={form.interests} onChange={(e) => updateField("interests", e.target.value)} />
              </div>
            </div>

            {status ? <p className={`text-sm ${status === "Profil gespeichert." ? "text-green-600" : "text-red-600"}`}>{status}</p> : null}

            <div className="flex gap-4 pt-6">
              <button type="submit" disabled={submitting} className="flex-[2] py-4 bg-[#af6aff] hover:bg-[#9e59eb] text-white font-black rounded-2xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? "Speichert..." : "Speichern"}
              </button>
              <button type="button" onClick={() => user && setForm({
                displayName: user.displayName || user.firstName || "",
                location: user.location || "",
                icebreaker: user.icebreaker || "",
                bio: user.bio || "",
                languages: toCsv(user.languages),
                interests: toCsv(user.interests),
              })} className="flex-1 py-4 bg-stone-100 dark:bg-[#292524] border border-stone-200 dark:border-stone-700 font-bold rounded-2xl hover:bg-stone-200 dark:hover:bg-stone-700 transition active:scale-95">
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

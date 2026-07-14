import { useEffect, useState } from "react";
import { Camera, ImagePlus, MapPin, Sparkles, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MAX_PICTURES = 6;

function toCsv(values) {
  return Array.isArray(values) ? values.join(", ") : "";
}

function mapUserToForm(user) {
  return {
    displayName: user.displayName || user.firstName || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    location: user.location || "",
    hometown: user.hometown || "",
    jobTitle: user.jobTitle || "",
    education: user.education || "",
    lookingFor: user.lookingFor || "",
    icebreaker: user.icebreaker || "",
    bio: user.bio || "",
    favoriteHangout: user.favoriteHangout || "",
    weekendMood: user.weekendMood || "",
    idealSunday: user.idealSunday || "",
    greenFlags: user.greenFlags || "",
    funFact: user.funFact || "",
    languages: toCsv(user.languages),
    interests: toCsv(user.interests),
    vibeTags: toCsv(user.vibeTags),
    pictures: Array.isArray(user.pictures) ? user.pictures : [],
  };
}

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Bild konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Bild konnte nicht verarbeitet werden."));
    image.src = dataUrl;
  });
}

async function optimizeImage(file) {
  const sourceDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(sourceDataUrl);
  const maxDimension = 1400;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return sourceDataUrl;
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function TextField({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-black/70 dark:text-white/70">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#221f1d] px-4 py-3 outline-none focus:ring-2 focus:ring-[#af6aff] transition"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-black/70 dark:text-white/70">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#221f1d] px-4 py-3 outline-none focus:ring-2 focus:ring-[#af6aff] transition resize-none"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-black/70 dark:text-white/70">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#221f1d] px-4 py-3 outline-none focus:ring-2 focus:ring-[#af6aff] transition"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function GalleryCard({ picture, isCover, onSetCover, onRemove }) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 aspect-[4/5]">
      <img src={picture} alt="Profilbild" className="w-full h-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          {isCover ? "Cover" : "Galerie"}
        </span>
        <div className="flex gap-2">
          {!isCover ? (
            <button
              type="button"
              onClick={onSetCover}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
            >
              Als Cover
            </button>
          ) : null}
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full bg-red-500/90 p-2 text-white"
            aria-label="Bild entfernen"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProfile() {
  const { user, loading, refreshProfile, updateProfile } = useAuth();
  const [form, setForm] = useState(() =>
    mapUserToForm({
      firstName: "",
      lastName: "",
      pictures: [],
    }),
  );
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      refreshProfile().catch(() => null);
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (user) {
      setForm(mapUserToForm(user));
    }
  }, [user]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handlePictureUpload(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const remainingSlots = Math.max(MAX_PICTURES - form.pictures.length, 0);
    if (remainingSlots === 0) {
      setStatus(`Maximal ${MAX_PICTURES} Bilder erlaubt.`);
      return;
    }

    setUploading(true);
    setStatus("");

    try {
      const nextPictures = await Promise.all(files.slice(0, remainingSlots).map(optimizeImage));
      setForm((current) => ({
        ...current,
        pictures: [...current.pictures, ...nextPictures],
      }));
      setStatus(nextPictures.length < files.length ? `Nur ${remainingSlots} weitere Bilder hinzugefuegt.` : "");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removePicture(index) {
    setForm((current) => ({
      ...current,
      pictures: current.pictures.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  function setCoverPicture(index) {
    setForm((current) => {
      const nextPictures = [...current.pictures];
      const [selected] = nextPictures.splice(index, 1);
      nextPictures.unshift(selected);
      return { ...current, pictures: nextPictures };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        displayName: form.displayName,
        location: form.location,
        hometown: form.hometown,
        jobTitle: form.jobTitle,
        education: form.education,
        lookingFor: form.lookingFor,
        icebreaker: form.icebreaker,
        bio: form.bio,
        favoriteHangout: form.favoriteHangout,
        weekendMood: form.weekendMood,
        idealSunday: form.idealSunday,
        greenFlags: form.greenFlags,
        funFact: form.funFact,
        languages: parseCsv(form.languages),
        interests: parseCsv(form.interests),
        vibeTags: parseCsv(form.vibeTags),
        pictures: form.pictures,
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

  const coverPicture = form.pictures[0];
  const profileName = form.displayName || form.firstName || "Du";

  return (
    <main className="min-h-screen p-4 md:p-8">
      <form className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-[380px_1fr]" onSubmit={handleSubmit}>
        <aside className="rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1c1917] shadow-xl overflow-hidden h-fit">
          <div className="relative h-80 bg-gradient-to-br from-[#8c72ff] via-[#6c3ef0] to-[#3b82f6]">
            {coverPicture ? (
              <img src={coverPicture} alt={profileName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <Camera size={64} />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/75 to-transparent">
              <h1 className="text-3xl font-black text-white">{profileName}</h1>
              <p className="mt-2 text-sm text-white/80">
                {form.jobTitle || "Profil ausbauen"} {form.location ? `· ${form.location}` : ""}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 dark:bg-[#262220] p-4">
              <Sparkles className="mt-1 text-[#af6aff]" size={18} />
              <div>
                <p className="text-sm font-bold text-black dark:text-white">Erster Eindruck</p>
                <p className="text-sm text-black/65 dark:text-white/65">
                  Coverbild + knackige Prompts schlagen hier gerade alles.
                </p>
              </div>
            </div>

            <label className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 px-4 py-4 text-sm font-semibold cursor-pointer hover:bg-stone-50 dark:hover:bg-white/5 transition">
              <ImagePlus size={18} />
              {uploading ? "Bilder werden geladen..." : "Bilder hinzufuegen"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePictureUpload}
              />
            </label>

            <p className="text-xs text-black/55 dark:text-white/55">
              Bis zu {MAX_PICTURES} Bilder. Das erste Bild ist automatisch dein Cover.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {form.pictures.length > 0 ? (
                form.pictures.map((picture, index) => (
                  <GalleryCard
                    key={`${picture.slice(0, 32)}-${index}`}
                    picture={picture}
                    isCover={index === 0}
                    onSetCover={() => setCoverPicture(index)}
                    onRemove={() => removePicture(index)}
                  />
                ))
              ) : (
                <div className="col-span-2 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 p-6 text-center text-sm text-black/55 dark:text-white/55">
                  Noch keine Bilder. Das wirkt in Swipe direkt duenn.
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1c1917] shadow-xl p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-black">Profil bearbeiten</h2>
            <div className="w-16 h-1.5 bg-[#af6aff] rounded-full mt-3" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <TextField label="Anzeigename" value={form.displayName} onChange={(event) => updateField("displayName", event.target.value)} placeholder="Wie sollen dich andere nennen?" />
            <TextField label="Vorname" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Vorname" />
            <TextField label="Nachname" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Nachname" />
            <TextField label="Wohnort" value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Wo bist du gerade?" />
            <TextField label="Herkunft / Heimat" value={form.hometown} onChange={(event) => updateField("hometown", event.target.value)} placeholder="Wo kommst du her?" />
            <SelectField
              label="Ich suche"
              value={form.lookingFor}
              onChange={(event) => updateField("lookingFor", event.target.value)}
              options={[
                { value: "", label: "Auswaehlen" },
                { value: "Neue Leute fuer Unternehmungen", label: "Neue Leute fuer Unternehmungen" },
                { value: "Dating mit echtem Kennenlernen", label: "Dating mit echtem Kennenlernen" },
                { value: "Freundschaften", label: "Freundschaften" },
                { value: "Spontane Events und Abende", label: "Spontane Events und Abende" },
              ]}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <TextField label="Job / Was machst du?" value={form.jobTitle} onChange={(event) => updateField("jobTitle", event.target.value)} placeholder="z. B. Informatikstudent, Designerin..." />
            <TextField label="Ausbildung / Uni" value={form.education} onChange={(event) => updateField("education", event.target.value)} placeholder="Uni, Ausbildung, Job-Kontext" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <TextField label="Sprachen" value={form.languages} onChange={(event) => updateField("languages", event.target.value)} placeholder="Deutsch, Englisch" />
            <TextField label="Interessen" value={form.interests} onChange={(event) => updateField("interests", event.target.value)} placeholder="Kaffee, Konzerte, Sport" />
          </div>

          <TextField label="Vibe-Tags" value={form.vibeTags} onChange={(event) => updateField("vibeTags", event.target.value)} placeholder="Dry Humor, Night Owl, Chaotic Good" />

          <div className="grid md:grid-cols-2 gap-4">
            <TextAreaField label="Bio" value={form.bio} onChange={(event) => updateField("bio", event.target.value)} placeholder="Kurz und ehrlich. Worum geht's bei dir?" />
            <TextAreaField label="Eisbrecher" value={form.icebreaker} onChange={(event) => updateField("icebreaker", event.target.value)} placeholder="Ein Satz, auf den man antworten kann." />
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 dark:border-stone-700 p-5 bg-stone-50 dark:bg-[#24201d] space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#af6aff]" />
              <h3 className="text-xl font-black">Prompts statt BlaBla</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <TextAreaField label="Mein perfekter Sonntag" value={form.idealSunday} onChange={(event) => updateField("idealSunday", event.target.value)} placeholder="Brunch, Spaziergang, abends Film..." rows={3} />
              <TextAreaField label="Green Flags bei Menschen" value={form.greenFlags} onChange={(event) => updateField("greenFlags", event.target.value)} placeholder="Humor, Verbindlichkeit, keine Spielchen..." rows={3} />
              <TextAreaField label="Lieblingsort fuer ein erstes Treffen" value={form.favoriteHangout} onChange={(event) => updateField("favoriteHangout", event.target.value)} placeholder="Cafe, Park, Bar, Flohmarkt..." rows={3} />
              <TextAreaField label="Wochenend-Mood" value={form.weekendMood} onChange={(event) => updateField("weekendMood", event.target.value)} placeholder="Eher ruhig, eher Chaos, irgendwas dazwischen?" rows={3} />
            </div>

            <TextAreaField label="Fun Fact" value={form.funFact} onChange={(event) => updateField("funFact", event.target.value)} placeholder="Etwas, das haengen bleibt." rows={3} />
          </div>

          {status ? (
            <p className={`text-sm font-medium ${status === "Profil gespeichert." ? "text-green-600" : "text-red-600"}`}>
              {status}
            </p>
          ) : null}

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex-1 rounded-2xl bg-[#6c3ef0] hover:bg-[#5d33d2] text-white font-black px-6 py-4 transition disabled:opacity-60"
            >
              {submitting ? "Speichert..." : "Profil speichern"}
            </button>
            <button
              type="button"
              onClick={() => user && setForm(mapUserToForm(user))}
              className="rounded-2xl border border-stone-200 dark:border-stone-700 px-6 py-4 font-bold hover:bg-stone-50 dark:hover:bg-white/5 transition"
            >
              Zuruecksetzen
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

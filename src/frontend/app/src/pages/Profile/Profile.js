import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, MapPin, Sparkles, Trash2, Search, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MAX_PICTURES = 6;
const LANGUAGE_POOL = ["Deutsch", "Englisch", "Spanisch", "Franzoesisch", "Italienisch", "Arabisch", "Tuerkisch", "Russisch", "Polnisch", "Portugiesisch", "Niederlaendisch", "Ukrainisch"];
const INTEREST_POOL = ["Kaffee", "Kochen", "Bars", "Clubs", "Techno", "Konzerte", "Festivals", "Gaming", "Filme", "Serien", "Fitness", "Gym", "Laufen", "Bouldern", "Wandern", "Reisen", "Roadtrips", "Fotografie", "Kunst", "Design", "Podcasts", "Lesen", "Meme", "Brettspiele", "Karaoke", "Spaziergaenge", "Brunch", "Startups", "Coding", "Kneipenquiz"];

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
    languages: Array.isArray(user.languages) ? user.languages : [],
    interests: Array.isArray(user.interests) ? user.interests : [],
    vibeTags: Array.isArray(user.vibeTags) ? user.vibeTags : [],
    pictures: Array.isArray(user.pictures) ? user.pictures : [],
  };
}

function mapUserToSwipePreferences(user) {
  return {
    preferredGender: user.preferences?.preferredGender || "",
    lookingForTerm: user.preferences?.lookingForTerm || "",
  };
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

function TagEditor({ label, values, onAdd, onRemove, placeholder }) {
  const [draft, setDraft] = useState("");

  function submitDraft() {
    const value = draft.trim();
    if (!value) {
      return;
    }
    onAdd(value);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-black/70 dark:text-white/70">{label}</span>
      <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#221f1d] px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span key={value} className="inline-flex items-center gap-2 rounded-full bg-[#af6aff]/12 px-3 py-1 text-sm font-semibold text-[#7b4bf3] dark:text-[#d4c6ff]">
              {value}
              <button type="button" onClick={() => onRemove(value)} className="text-current/70 hover:text-current">
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                submitDraft();
              }
            }}
            onBlur={submitDraft}
            placeholder={placeholder}
            className="min-w-[10rem] flex-1 bg-transparent outline-none text-sm py-1"
          />
        </div>
      </div>
    </div>
  );
}

function PoolSelector({ label, values, pool, onToggle, required = false }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-black/70 dark:text-white/70">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#221f1d] px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {pool.map((entry) => {
            const active = values.includes(entry);
            return (
              <button
                key={entry}
                type="button"
                onClick={() => onToggle(entry)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#6c3ef0] text-white shadow-md"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700"
                }`}
              >
                {entry}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CityField({
  label,
  value,
  placeholder,
  onChange,
  onFocus,
  results,
  showResults,
  searching,
  onSelect,
  boxRef,
}) {
  return (
    <div className="flex flex-col gap-2" ref={boxRef}>
      <span className="text-sm font-bold text-black/70 dark:text-white/70">{label}</span>
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#221f1d] pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#af6aff] transition"
        />
        {showResults && results.length > 0 ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1A1C1E] shadow-xl">
            {results.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => onSelect(place)}
                className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-white/5 transition border-b last:border-b-0 border-stone-100 dark:border-white/5"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{place.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{place.label}</p>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <p className="text-xs text-black/55 dark:text-white/55">
        {searching ? "Suche nach Staedten..." : "Nur Stadt-Vorschlaege fuer saubere Profildaten."}
      </p>
    </div>
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
  const { user, loading, refreshProfile, updatePreferences, updateProfile, searchCities } = useAuth();
  const locationBoxRef = useRef(null);
  const hometownBoxRef = useRef(null);
  const [form, setForm] = useState(() => mapUserToForm({ firstName: "", lastName: "", pictures: [] }));
  const [swipePreferences, setSwipePreferences] = useState(() => mapUserToSwipePreferences({ preferences: {} }));
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [locationResults, setLocationResults] = useState([]);
  const [hometownResults, setHometownResults] = useState([]);
  const [searchingField, setSearchingField] = useState("");
  const [activeCityField, setActiveCityField] = useState("");

  useEffect(() => {
    if (!user) {
      refreshProfile().catch(() => null);
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (user) {
      setForm(mapUserToForm(user));
      setSwipePreferences(mapUserToSwipePreferences(user));
    }
  }, [user]);

  useEffect(() => {
    if (!activeCityField) {
      return;
    }

    const query = activeCityField === "location" ? form.location : form.hometown;
    if (!query || query.trim().length < 3) {
      if (activeCityField === "location") {
        setLocationResults([]);
      } else {
        setHometownResults([]);
      }
      setSearchingField("");
      return;
    }

    let active = true;
    setSearchingField(activeCityField);

    const timeoutId = window.setTimeout(() => {
      searchCities(query)
        .then((results) => {
          if (!active) {
            return;
          }
          if (activeCityField === "location") {
            setLocationResults(results);
          } else {
            setHometownResults(results);
          }
        })
        .catch(() => {
          if (!active) {
            return;
          }
          if (activeCityField === "location") {
            setLocationResults([]);
          } else {
            setHometownResults([]);
          }
        })
        .finally(() => {
          if (active) {
            setSearchingField("");
          }
        });
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [activeCityField, form.location, form.hometown, searchCities]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (locationBoxRef.current?.contains(event.target) || hometownBoxRef.current?.contains(event.target)) {
        return;
      }
      setActiveCityField("");
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addTag(field, value) {
    setForm((current) => {
      const normalized = value.trim();
      if (!normalized) {
        return current;
      }
      const entries = current[field] || [];
      if (entries.some((entry) => entry.toLowerCase() === normalized.toLowerCase())) {
        return current;
      }
      return { ...current, [field]: [...entries, normalized] };
    });
  }

  function removeTag(field, value) {
    setForm((current) => ({
      ...current,
      [field]: (current[field] || []).filter((entry) => entry !== value),
    }));
  }

  function togglePoolTag(field, value) {
    setForm((current) => {
      const hasValue = current[field].includes(value);
      return {
        ...current,
        [field]: hasValue ? current[field].filter((entry) => entry !== value) : [...current[field], value],
      };
    });
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

    if (!form.displayName.trim()) {
      setStatus("Anzeigename ist erforderlich.");
      setSubmitting(false);
      return;
    }

    if (!form.firstName.trim()) {
      setStatus("Vorname ist erforderlich.");
      setSubmitting(false);
      return;
    }

    if (!form.location.trim()) {
      setStatus("Wohnort ist erforderlich.");
      setSubmitting(false);
      return;
    }

    if (form.languages.length === 0) {
      setStatus("Waehle mindestens eine Sprache aus.");
      setSubmitting(false);
      return;
    }

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
        languages: form.languages,
        interests: form.interests,
        vibeTags: form.vibeTags,
        pictures: form.pictures,
      });
      await updatePreferences({
        preferredGender: swipePreferences.preferredGender,
        lookingForTerm: swipePreferences.lookingForTerm,
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
            {coverPicture ? <img src={coverPicture} alt={profileName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white"><Camera size={64} /></div>}
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
                  Coverbild + gute Tags schlagen hier gerade alles.
                </p>
              </div>
            </div>

            <label className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 px-4 py-4 text-sm font-semibold cursor-pointer hover:bg-stone-50 dark:hover:bg-white/5 transition">
              <ImagePlus size={18} />
              {uploading ? "Bilder werden geladen..." : "Bilder hinzufuegen"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePictureUpload} />
            </label>

            <p className="text-xs text-black/55 dark:text-white/55">
              Bis zu {MAX_PICTURES} Bilder. Das erste Bild ist automatisch dein Cover.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {form.pictures.length > 0 ? form.pictures.map((picture, index) => (
                <GalleryCard
                  key={`${picture.slice(0, 32)}-${index}`}
                  picture={picture}
                  isCover={index === 0}
                  onSetCover={() => setCoverPicture(index)}
                  onRemove={() => removePicture(index)}
                />
              )) : (
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
            <TextField label="Anzeigename *" value={form.displayName} onChange={(event) => updateField("displayName", event.target.value)} placeholder="Wie sollen dich andere nennen?" />
            <TextField label="Vorname *" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Vorname" />
            <TextField label="Nachname" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Nachname" />
            <CityField
              label="Wohnort *"
              value={form.location}
              placeholder="Stadt waehlen"
              onChange={(event) => {
                updateField("location", event.target.value);
                setActiveCityField("location");
              }}
              onFocus={() => setActiveCityField("location")}
              results={locationResults}
              showResults={activeCityField === "location"}
              searching={searchingField === "location"}
              onSelect={(place) => {
                updateField("location", place.name);
                setLocationResults([]);
                setActiveCityField("");
              }}
              boxRef={locationBoxRef}
            />
            <CityField
              label="Herkunft / Heimat"
              value={form.hometown}
              placeholder="Heimatstadt waehlen"
              onChange={(event) => {
                updateField("hometown", event.target.value);
                setActiveCityField("hometown");
              }}
              onFocus={() => setActiveCityField("hometown")}
              results={hometownResults}
              showResults={activeCityField === "hometown"}
              searching={searchingField === "hometown"}
              onSelect={(place) => {
                updateField("hometown", place.name);
                setHometownResults([]);
                setActiveCityField("");
              }}
              boxRef={hometownBoxRef}
            />
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
            <PoolSelector label="Sprachen" values={form.languages} pool={LANGUAGE_POOL} onToggle={(value) => togglePoolTag("languages", value)} required />
            <PoolSelector label="Interessen" values={form.interests} pool={INTEREST_POOL} onToggle={(value) => togglePoolTag("interests", value)} />
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 dark:border-stone-700 p-5 bg-stone-50 dark:bg-[#24201d] space-y-4">
            <div>
              <h3 className="text-xl font-black">Swipe-Einstellungen</h3>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                Hier hin mit Filtern. Im Swipe selbst soll spaeter nur noch like, pass und mehr Infos leben.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <SelectField
                label="Gewuenschtes Gender"
                value={swipePreferences.preferredGender}
                onChange={(event) =>
                  setSwipePreferences((current) => ({ ...current, preferredGender: event.target.value }))
                }
                options={[
                  { value: "", label: "Alle" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "neutral", label: "Neutral" },
                ]}
              />
              <TextField
                label="Wonach filtern?"
                value={swipePreferences.lookingForTerm}
                onChange={(event) =>
                  setSwipePreferences((current) => ({ ...current, lookingForTerm: event.target.value }))
                }
                placeholder="z. B. Dating, Freundschaften, Events..."
              />
            </div>
          </div>

          <TagEditor label="Vibe-Tags" values={form.vibeTags} onAdd={(value) => addTag("vibeTags", value)} onRemove={(value) => removeTag("vibeTags", value)} placeholder="Dry Humor, Night Owl, Chaotic Good" />

          <div className="grid md:grid-cols-2 gap-4">
            <TextAreaField label="Bio" value={form.bio} onChange={(event) => updateField("bio", event.target.value)} placeholder="Kurz und ehrlich. Worum geht's bei dir?" />
            <TextAreaField label="Eisbrecher" value={form.icebreaker} onChange={(event) => updateField("icebreaker", event.target.value)} placeholder="Ein Satz, auf den man antworten kann." />
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 dark:border-stone-700 p-5 bg-stone-50 dark:bg-[#24201d] space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#af6aff]" />
              <h3 className="text-xl font-black">Ueber mich</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <TextAreaField label="Mein perfekter Sonntag" value={form.idealSunday} onChange={(event) => updateField("idealSunday", event.target.value)} placeholder="Brunch, Spaziergang, abends Film..." rows={3} />
              <TextAreaField label="Green Flags bei Menschen" value={form.greenFlags} onChange={(event) => updateField("greenFlags", event.target.value)} placeholder="Humor, Verbindlichkeit, keine Spielchen..." rows={3} />
              <TextAreaField label="Lieblingsort fuer ein erstes Treffen" value={form.favoriteHangout} onChange={(event) => updateField("favoriteHangout", event.target.value)} placeholder="Cafe, Park, Bar, Flohmarkt..." rows={3} />
              <TextAreaField label="Wochenend-Mood" value={form.weekendMood} onChange={(event) => updateField("weekendMood", event.target.value)} placeholder="Eher ruhig, eher Chaos, irgendwas dazwischen?" rows={3} />
            </div>

            <TextAreaField label="Fun Fact" value={form.funFact} onChange={(event) => updateField("funFact", event.target.value)} placeholder="Etwas, das haengen bleibt." rows={3} />
          </div>

          {status ? <p className={`text-sm font-medium ${status === "Profil gespeichert." ? "text-green-600" : "text-red-600"}`}>{status}</p> : null}

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button type="submit" disabled={submitting || uploading} className="flex-1 rounded-2xl bg-[#6c3ef0] hover:bg-[#5d33d2] text-white font-black px-6 py-4 transition disabled:opacity-60">
              {submitting ? "Speichert..." : "Profil speichern"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  return;
                }
                setForm(mapUserToForm(user));
                setSwipePreferences(mapUserToSwipePreferences(user));
              }}
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

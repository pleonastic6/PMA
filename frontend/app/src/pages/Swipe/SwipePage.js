import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SWIPE_MODES = [
  { key: "people", label: "Menschen" },
  { key: "interests", label: "Hobbys" },
  { key: "events", label: "Events" },
  { key: "locations", label: "Locations" },
];

function AuthHint() {
  return <main className="min-h-screen flex items-center justify-center">Bitte erst einloggen, um zu swipen.</main>;
}

function CardVisual({ slide, fallback }) {
  if (slide?.picture) {
    return <img src={slide.picture} alt={fallback} className="w-full h-full object-cover" />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#af6aff] via-[#7e6dff] to-[#5a8dff] text-white text-5xl font-black">
      {String(fallback || "?").slice(0, 1).toUpperCase()}
    </div>
  );
}

function calculateAge(birthDate) {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

function matchesPreferredGender(candidate, preferredGender) {
  if (!preferredGender) {
    return true;
  }

  const normalizedGender = String(candidate.gender || "").toLowerCase();

  if (preferredGender === "neutral") {
    return normalizedGender === "other" || normalizedGender === "diverse" || normalizedGender === "prefer_not_to_say";
  }

  return normalizedGender === preferredGender;
}

function matchesLookingFor(candidate, lookingForFilter) {
  if (!lookingForFilter) {
    return true;
  }

  return String(candidate.lookingFor || "").toLowerCase().includes(String(lookingForFilter).trim().toLowerCase());
}

function getCommonTags(currentUser, candidate) {
  const currentTags = new Set(
    [
      ...(currentUser?.interests || []),
      ...(currentUser?.vibeTags || []),
      ...(currentUser?.languages || []),
    ].map((entry) => String(entry).trim().toLowerCase()),
  );

  return [
    ...(candidate?.interests || []),
    ...(candidate?.vibeTags || []),
    ...(candidate?.languages || []),
  ].filter((entry, index, values) => {
    const normalized = String(entry).trim().toLowerCase();
    return currentTags.has(normalized) && values.findIndex((value) => String(value).trim().toLowerCase() === normalized) === index;
  });
}

function buildPeopleSlides(candidate) {
  const candidateAge = calculateAge(candidate?.birthDate);
  const profileName = candidate.displayName || candidate.firstName || candidate.username;
  const pictures = Array.isArray(candidate.pictures) && candidate.pictures.length > 0 ? candidate.pictures : [null];
  const slides = pictures.map((picture, index) => ({
    id: `picture-${index}`,
    picture,
    eyebrow: index === 0 ? "Profil" : `Bild ${index + 1}`,
    title: candidateAge ? `${profileName}, ${candidateAge}` : profileName,
    subtitle: `@${candidate.username}`,
    body: candidate.bio || "Noch keine Bio.",
    chips: [
      candidate.location || "Unbekannt",
      ...(candidate.vibeTags || []).slice(0, 3),
    ].filter(Boolean),
  }));

  slides.push({
    id: "about",
    picture: pictures[0] || null,
    eyebrow: "About",
    title: candidate.icebreaker || "Noch kein Eisbrecher",
    subtitle: candidate.lookingFor || "Offen fuer neue Kontakte",
    body: candidate.favoriteHangout || candidate.jobTitle || "Hier fehlt noch etwas Persoenlichkeit.",
    chips: [
      candidate.jobTitle,
      candidate.education,
      candidate.favoriteHangout,
    ].filter(Boolean),
  });

  slides.push({
    id: "vibe",
    picture: pictures[Math.min(1, pictures.length - 1)] || pictures[0] || null,
    eyebrow: "Vibe",
    title: candidate.weekendMood || "Wochenend-Mood folgt",
    subtitle: candidate.idealSunday || candidate.greenFlags || "Noch keine Prompt-Antwort",
    body: candidate.funFact || "Kein Fun Fact hinterlegt.",
    chips: [
      ...(candidate.languages || []).slice(0, 3),
      ...(candidate.interests || []).slice(0, 3),
    ].filter(Boolean),
  });

  return slides;
}

function buildInterestSlides(interest) {
  return [
    {
      id: "interest-main",
      eyebrow: "Hobby",
      title: interest.name,
      subtitle: interest.isOwnInterest ? "Schon in deinem Profil" : "Neuer Discovery-Anker",
      body: interest.description,
      chips: [
        interest.peopleCount ? `${interest.peopleCount} Profile` : null,
        interest.eventTitles?.length ? `${interest.eventTitles.length} passende Events` : null,
      ].filter(Boolean),
    },
    {
      id: "interest-context",
      eyebrow: "Kontext",
      title: "Warum das relevant ist",
      subtitle: "Von Stakeholder-Feedback zu swipebarem Kontext",
      body: interest.eventTitles?.length
        ? `Dieses Interesse dockt an bestehende Events an: ${interest.eventTitles.join(", ")}.`
        : "Dieses Interesse taucht als gemeinsamer Nenner in mehreren Profilen auf und kann spaeter gezielt Events/Orte verbinden.",
      chips: [
        ...(interest.eventTitles || []),
      ].filter(Boolean),
    },
  ];
}

function buildEventSlides(event) {
  return [
    {
      id: "event-main",
      eyebrow: "Event",
      title: event.title,
      subtitle: `${event.date} · ${event.time} Uhr`,
      body: event.description || "Noch keine Beschreibung.",
      chips: [
        event.category,
        event.locationName,
        event.creator?.displayName || event.creator?.username,
      ].filter(Boolean),
    },
    {
      id: "event-context",
      eyebrow: "Ort",
      title: event.locationName || "Ohne Ort",
      subtitle: "Swipebarer sozialer Kontext",
      body: "Events lassen sich jetzt direkt im Swipe-Bereich durchgehen, statt nur als getrennte Liste nebenher zu existieren.",
      chips: [
        event.category || "Event",
        event.position ? "Mit Kartenbezug" : null,
      ].filter(Boolean),
    },
  ];
}

function buildLocationSlides(location) {
  return [
    {
      id: "location-main",
      eyebrow: "Location",
      title: location.name,
      subtitle: `${location.eventCount || 0} Event(s) · ${location.residentCount || 0} Profile`,
      body: location.description,
      chips: [
        location.position ? "Auf Karte verortet" : "Ohne Geopunkt",
      ],
    },
    {
      id: "location-context",
      eyebrow: "Hotspot",
      title: "Was dort schon passiert",
      subtitle: "Orte als eigener Discovery-Einstieg",
      body: location.eventTitles?.length
        ? `Rund um diesen Ort gibt es bereits: ${location.eventTitles.join(", ")}.`
        : "Der Ort ist aktuell eher als Profilbezug sichtbar und kann spaeter mit mehr Events weiter aufgeladen werden.",
      chips: [
        ...(location.eventTitles || []).slice(0, 3),
      ].filter(Boolean),
    },
  ];
}

function normalizeDiscoveryPayload(payload) {
  if (Array.isArray(payload)) {
    return {
      people: payload,
      interests: [],
      events: [],
      locations: [],
    };
  }

  return {
    people: Array.isArray(payload?.people) ? payload.people : [],
    interests: Array.isArray(payload?.interests) ? payload.interests : [],
    events: Array.isArray(payload?.events) ? payload.events : [],
    locations: Array.isArray(payload?.locations) ? payload.locations : [],
  };
}

function getSlidesForMode(mode, item) {
  if (!item) {
    return [];
  }

  if (mode === "people") {
    return buildPeopleSlides(item);
  }

  if (mode === "interests") {
    return buildInterestSlides(item);
  }

  if (mode === "events") {
    return buildEventSlides(item);
  }

  return buildLocationSlides(item);
}

function getProfileTarget(mode, item, navigate) {
  if (mode !== "people" || !item?.id) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(`/people/${item.id}`, { state: { profile: item } })}
      className="rounded-2xl border border-stone-300 dark:border-stone-700 font-bold px-4 py-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
    >
      Profil
    </button>
  );
}

export default function SwipePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, getDiscovery, swipe } = useAuth();
  const [discovery, setDiscovery] = useState({
    people: [],
    interests: [],
    events: [],
    locations: [],
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [matchNotice, setMatchNotice] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeMode, setActiveMode] = useState("people");
  const preferredGender = user?.preferences?.preferredGender || "";
  const lookingForTerm = user?.preferences?.lookingForTerm || "";

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let active = true;

    getDiscovery()
      .then((data) => {
        if (active) {
          setDiscovery(normalizeDiscoveryPayload(data));
        }
      })
      .catch((error) => {
        if (active) {
          setStatus(error.message);
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
  }, [isAuthenticated, getDiscovery]);

  const peopleCandidates = useMemo(
    () =>
      discovery.people.filter(
        (candidate) =>
          matchesPreferredGender(candidate, preferredGender) &&
          matchesLookingFor(candidate, lookingForTerm),
      ),
    [discovery.people, preferredGender, lookingForTerm],
  );

  const decks = useMemo(
    () => ({
      people: peopleCandidates,
      interests: discovery.interests,
      events: discovery.events,
      locations: discovery.locations,
    }),
    [discovery.events, discovery.interests, discovery.locations, peopleCandidates],
  );

  useEffect(() => {
    if (!decks[activeMode]?.length) {
      const nextMode = SWIPE_MODES.find((mode) => decks[mode.key]?.length > 0)?.key || "people";
      if (nextMode !== activeMode) {
        setActiveMode(nextMode);
      }
    }
  }, [activeMode, decks]);

  const activeDeck = decks[activeMode] || [];
  const activeItem = activeDeck[0];
  const slides = useMemo(() => getSlidesForMode(activeMode, activeItem), [activeItem, activeMode]);
  const currentSlide = slides[activeSlide];
  const commonTags = activeMode === "people" && activeItem ? getCommonTags(user, activeItem) : [];

  useEffect(() => {
    setActiveSlide(0);
  }, [activeMode, activeItem?.id]);

  async function handleSwipe(direction) {
    if (!activeItem) {
      return;
    }

    if (activeMode === "people") {
      try {
        const result = await swipe({
          targetUserId: activeItem.id,
          direction,
        });

        setDiscovery((current) => ({
          ...current,
          people: current.people.filter((entry) => entry.id !== activeItem.id),
        }));
        setStatus(direction === "like" ? `${activeItem.username} geliked.` : `${activeItem.username} übersprungen.`);
        setMatchNotice(result.isMatch ? `It's a match mit ${activeItem.username}.` : "");
      } catch (error) {
        setStatus(error.message);
        setMatchNotice("");
      }

      return;
    }

    setDiscovery((current) => ({
      ...current,
      [activeMode]: (current[activeMode] || []).filter((entry) => entry.id !== activeItem.id),
    }));
    setMatchNotice("");
    setStatus(`${activeMode === "interests" ? activeItem.name : activeItem.title || activeItem.name} ${direction === "like" ? "geliked" : "übersprungen"}.`);
  }

  function goToPreviousSlide() {
    setActiveSlide((current) => (current > 0 ? current - 1 : current));
  }

  function goToNextSlide() {
    setActiveSlide((current) => (current < slides.length - 1 ? current + 1 : current));
  }

  function handleCardNavigation(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const clickedOnLeftSide = event.clientX - bounds.left < bounds.width / 2;

    if (clickedOnLeftSide) {
      goToPreviousSlide();
      return;
    }

    goToNextSlide();
  }

  if (!isAuthenticated) {
    return <AuthHint />;
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Kandidaten werden geladen...</main>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-[#1c1917] rounded-[2rem] shadow-xl border border-stone-200 dark:border-stone-800 p-8">
        <h1 className="text-3xl font-extrabold">Swipe</h1>
        <div className="w-16 h-1.5 bg-[#af6aff] rounded-full mt-3 mb-6" />

        <div className="mb-6 flex flex-wrap gap-2">
          {SWIPE_MODES.map((mode) => {
            const isActive = mode.key === activeMode;
            const count = decks[mode.key]?.length || 0;

            return (
              <button
                key={mode.key}
                type="button"
                onClick={() => {
                  setActiveMode(mode.key);
                  setStatus("");
                  setMatchNotice("");
                }}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-[#af6aff] text-white"
                    : "border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                {mode.label} · {count}
              </button>
            );
          })}
        </div>

        {activeItem ? (
          <div className="space-y-6">
            <div
              role="button"
              tabIndex={0}
              onClick={handleCardNavigation}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  goToPreviousSlide();
                }
                if (event.key === "ArrowRight") {
                  goToNextSlide();
                }
              }}
              className="rounded-[1.5rem] border border-stone-200 dark:border-stone-700 p-4 bg-stone-50 dark:bg-[#292524] cursor-pointer select-none"
            >
              <div className="mb-4 flex gap-2">
                {slides.map((slide, index) => (
                  <span
                    key={slide.id}
                    className={`h-1.5 flex-1 rounded-full transition ${
                      index === activeSlide ? "bg-[#af6aff]" : "bg-stone-300 dark:bg-stone-700"
                    }`}
                  />
                ))}
              </div>
              <div className="relative min-h-[34rem] overflow-hidden rounded-[1.5rem] bg-stone-200 dark:bg-stone-800">
                <div className="absolute inset-0">
                  <CardVisual slide={currentSlide} fallback={currentSlide?.title || activeItem?.displayName || activeItem?.name} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/5" />
                <div className="absolute inset-y-0 left-0 w-1/2" />
                <div className="absolute inset-y-0 right-0 w-1/2" />
                <div className="relative z-10 flex min-h-[34rem] flex-col justify-end p-6 text-white">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                        {currentSlide?.eyebrow}
                      </p>
                      <h2 className="mt-2 text-3xl font-black">{currentSlide?.title}</h2>
                      <p className="mt-1 text-sm text-white/80">{currentSlide?.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
                      {activeSlide + 1}/{slides.length}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/92">
                    {currentSlide?.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentSlide?.chips?.map((chip) => (
                      <span
                        key={`${currentSlide.id}-${chip}`}
                        className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  {commonTags.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f6df71]">
                        Gemeinsame Tags
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {commonTags.map((tag) => (
                          <span
                            key={`common-${tag}`}
                            className="rounded-full border border-[#f6df71]/30 bg-[#f6df71]/20 px-3 py-1 text-xs font-bold text-[#fff1a6]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <p className="mt-5 text-xs font-medium text-white/65">
                    Links klicken = zurueck, rechts klicken = weiter
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {getProfileTarget(activeMode, activeItem, navigate)}
              <button
                type="button"
                onClick={() => handleSwipe("pass")}
                className="flex-1 py-4 rounded-2xl border border-stone-300 dark:border-stone-700 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                Pass
              </button>
              <button
                type="button"
                onClick={() => handleSwipe("like")}
                className="flex-1 py-4 rounded-2xl bg-[#af6aff] hover:bg-[#9e59eb] text-white font-black transition"
              >
                Like
              </button>
            </div>
          </div>
        ) : (
          <p className="text-black/70 dark:text-white/70">
            Keine weiteren Eintraege in diesem Swipe-Deck. Seed ggf. neue Demo-Daten oder wechsle oben in eine andere Kategorie.
          </p>
        )}

        {status ? <p className="mt-6 text-sm text-black/70 dark:text-white/70">{status}</p> : null}
        {matchNotice ? <p className="mt-2 text-sm text-green-600 font-semibold">{matchNotice}</p> : null}
      </div>
    </main>
  );
}

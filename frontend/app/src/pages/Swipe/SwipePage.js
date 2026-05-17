import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, MessageCircle, SlidersHorizontal, Star, X } from 'lucide-react';

import { useAppState } from '../../context/AppStateContext';

export default function SwipePage() {
  const navigate = useNavigate();
  const {
    availableProfiles,
    preferences,
    resetDiscovery,
    swipeProfile,
  } = useAppState();

  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [matchedMatchId, setMatchedMatchId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(0);

  const profiles = useMemo(() => availableProfiles.slice(0, 20), [availableProfiles]);

  const swipe = (direction) => {
    if (isAnimating || profiles.length === 0) return;

    const currentProfile = profiles[0];
    setIsDragging(false);
    setIsAnimating(true);
    setFlyDirection(direction);

    if (direction === 'right') {
      setMatchedProfile(currentProfile);
      setMatchedMatchId(null);
      setShowMatch(true);
    }

    setTimeout(() => {
      const match = swipeProfile(currentProfile.id, direction);
      if (direction === 'right') {
        setMatchedMatchId(match?.id ?? null);
      }
      setFlyDirection(null);
      setOffset(0);
      setIsAnimating(false);
    }, 380);
  };

  const onPointerDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX ?? e.touches?.[0]?.clientX;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    setOffset(x - startX.current);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (offset > 120) swipe('right');
    else if (offset < -120) swipe('left');
    else setOffset(0);
  };

  const getTopCardTransform = () => {
    if (flyDirection === 'right') return 'translateX(110vw) rotate(30deg)';
    if (flyDirection === 'left') return 'translateX(-110vw) rotate(-30deg)';
    return `translateX(${offset}px) rotate(${offset * 0.07}deg)`;
  };

  const likeOpacity = Math.min(1, offset > 0 ? offset / 100 : 0);
  const nopeOpacity = Math.min(1, offset < 0 ? -offset / 100 : 0);

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 px-4 text-center">
        <div className="text-6xl">✨</div>
        <h2 className="text-2xl font-bold">Gerade nichts Neues mehr</h2>
        <p className="max-w-md text-gray-500">
          Passe deine Filter an oder lade den Discovery-Stack neu, um frische Vorschläge zu sehen.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={resetDiscovery}
            className="rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-semibold text-white"
          >
            Vorschläge neu laden
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 dark:border-white/10 dark:text-white"
          >
            Filter anpassen
          </button>
        </div>
      </div>
    );
  }

  const visibleCards = profiles.slice(0, 3).reverse();
  const currentProfile = profiles[0];

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-8">
      {showMatch && matchedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-8 text-center text-white shadow-2xl">
            <div className="mb-2 text-5xl">💜</div>
            <h2 className="text-3xl font-extrabold">Match mit {matchedProfile.name}!</h2>
            <p className="mt-2 text-sm text-white/85">
              {matchedProfile.compatibility}% Match-Fit · {matchedProfile.interests.slice(0, 2).join(' & ')} klingt nach einem starken Start.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowMatch(false);
                  navigate('/matches', { state: { matchId: matchedMatchId } });
                }}
                disabled={!matchedMatchId}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageCircle size={16} />
                {matchedMatchId ? 'Zu eurem Chat' : 'Chat wird vorbereitet...'}
              </button>
              <button
                type="button"
                onClick={() => setShowMatch(false)}
                className="rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Weiter swipen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#181b22] dark:text-white lg:w-[360px]">
          <p className="text-sm font-medium text-violet-500">Discover</p>
          <h1 className="mt-1 text-3xl font-extrabold">Neue Leute für dich</h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Fokus: {preferences.ageRange[0]}–{preferences.ageRange[1]} Jahre · {preferences.radiusKm} km · {(preferences.interestFilters.length > 0 ? preferences.interestFilters.join(', ') : 'alle Interessen')}
          </p>

          <div className="mt-6 space-y-3 rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Gerade oben im Stack</span>
              <span className="font-semibold">{profiles.length} sichtbar</span>
            </div>
            <div>
              <p className="font-semibold">{currentProfile.name}, {currentProfile.age}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentProfile.city} · {currentProfile.distanceKm} km entfernt</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProfile.interests.map((interest) => (
                <span key={interest} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-white">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            <SlidersHorizontal size={16} />
            Filter verfeinern
          </button>
        </section>

        <div className="flex flex-1 flex-col items-center justify-center select-none">
          <div className="relative w-full max-w-sm" style={{ height: '520px' }}>
            {visibleCards.map((profile, i) => {
              const isTop = i === visibleCards.length - 1;
              const stackIndex = visibleCards.length - 1 - i;
              const scale = 1 - stackIndex * 0.04;
              const translateY = stackIndex * 12;

              return (
                <div
                  key={profile.id}
                  className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl"
                  style={{
                    zIndex: i + 1,
                    transform: isTop ? getTopCardTransform() : `translateY(${translateY}px) scale(${scale})`,
                    transition: isTop && isDragging ? 'none' : 'transform 0.35s ease',
                    cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  }}
                  onMouseDown={isTop && !showMatch ? onPointerDown : undefined}
                  onMouseMove={isTop && !showMatch ? onPointerMove : undefined}
                  onMouseUp={isTop && !showMatch ? onPointerUp : undefined}
                  onMouseLeave={isTop && !showMatch ? onPointerUp : undefined}
                  onTouchStart={isTop && !showMatch ? (e) => onPointerDown(e.touches[0]) : undefined}
                  onTouchMove={isTop && !showMatch ? (e) => onPointerMove(e.touches[0]) : undefined}
                  onTouchEnd={isTop && !showMatch ? onPointerUp : undefined}
                >
                  <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${profile.gradient}`}>
                    <span className="select-none text-white/20 font-black" style={{ fontSize: '140px', lineHeight: 1 }}>
                      {profile.initials}
                    </span>
                  </div>

                  {isTop && (
                    <div className="absolute left-8 top-8 rounded-xl border-4 border-emerald-400 px-4 py-2" style={{ opacity: likeOpacity, transform: 'rotate(-20deg)' }}>
                      <span className="text-2xl font-extrabold tracking-widest text-emerald-400">TREFFEN</span>
                    </div>
                  )}

                  {isTop && (
                    <div className="absolute right-8 top-8 rounded-xl border-4 border-rose-400 px-4 py-2" style={{ opacity: nopeOpacity, transform: 'rotate(20deg)' }}>
                      <span className="text-2xl font-extrabold tracking-widest text-rose-400">NOPE</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
                        <div className="mt-1 flex items-center gap-1 text-sm text-white/70">
                          <MapPin size={13} />
                          <span>{profile.city} · {profile.distanceKm} km</span>
                        </div>
                      </div>
                      <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                        {profile.compatibility}% Fit
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/90">{profile.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <span key={interest} className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-6">
            <button
              disabled={isAnimating || showMatch}
              onClick={() => swipe('left')}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-500 shadow-lg transition-all active:scale-90 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:bg-stone-800 dark:hover:bg-rose-900/20"
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            <button
              disabled={isAnimating || showMatch}
              onClick={() => swipe('right')}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-100 bg-white text-yellow-500 shadow-lg transition-all active:scale-90 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-yellow-900 dark:bg-stone-800 dark:hover:bg-yellow-900/20"
            >
              <Star size={24} strokeWidth={2} />
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">Karte ziehen oder Buttons nutzen</p>
        </div>
      </div>
    </div>
  );
}

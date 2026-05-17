import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, MessageCircle, X, Star } from 'lucide-react';

import { mockProfiles } from '../../data/swipeData';

export default function SwipePage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(mockProfiles);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(0);

  const swipe = (direction) => {
    if (isAnimating || profiles.length === 0) return;

    const currentProfile = profiles[0];
    setIsDragging(false);
    setIsAnimating(true);
    setFlyDirection(direction);

    if (direction === 'right') {
      setMatchedProfile(currentProfile);
      setShowMatch(true);
    }

    setTimeout(() => {
      setProfiles((prev) => prev.slice(1));
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 text-center px-4">
        <div className="text-6xl">✨</div>
        <h2 className="text-2xl font-bold">Keine Profile mehr</h2>
        <p className="text-gray-500">Schau später nochmal vorbei!</p>
        <button
          onClick={() => {
            setProfiles(mockProfiles);
            setMatchedProfile(null);
          }}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full font-semibold"
        >
          Nochmal laden
        </button>
      </div>
    );
  }

  const visibleCards = profiles.slice(0, 3).reverse();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 select-none">
      {showMatch && matchedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-8 text-center text-white shadow-2xl">
            <div className="mb-2 text-5xl">💜</div>
            <h2 className="text-3xl font-extrabold">Match mit {matchedProfile.name}!</h2>
            <p className="mt-2 text-sm text-white/85">{matchedProfile.compatibility}% Match-Fit · Zeit für den ersten Chat.</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowMatch(false);
                  navigate('/matches');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                <MessageCircle size={16} />
                Zu den Chats
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

      <div className="relative w-full max-w-sm" style={{ height: '520px' }}>
        {visibleCards.map((profile, i) => {
          const isTop = i === visibleCards.length - 1;
          const stackIndex = visibleCards.length - 1 - i;
          const scale = 1 - stackIndex * 0.04;
          const translateY = stackIndex * 12;

          return (
            <div
              key={profile.id}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                zIndex: i + 1,
                transform: isTop
                  ? getTopCardTransform()
                  : `translateY(${translateY}px) scale(${scale})`,
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
              <div className={`w-full h-full bg-gradient-to-br ${profile.gradient} flex items-center justify-center`}>
                <span className="text-white/20 font-black select-none" style={{ fontSize: '140px', lineHeight: 1 }}>
                  {profile.initials}
                </span>
              </div>

              {isTop && (
                <div
                  className="absolute top-8 left-8 border-4 border-emerald-400 rounded-xl px-4 py-2"
                  style={{ opacity: likeOpacity, transform: 'rotate(-20deg)' }}
                >
                  <span className="text-emerald-400 font-extrabold text-2xl tracking-widest">TREFFEN</span>
                </div>
              )}

              {isTop && (
                <div
                  className="absolute top-8 right-8 border-4 border-rose-400 rounded-xl px-4 py-2"
                  style={{ opacity: nopeOpacity, transform: 'rotate(20deg)' }}
                >
                  <span className="text-rose-400 font-extrabold text-2xl tracking-widest">NOPE</span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
                <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                  <MapPin size={13} />
                  <span>{profile.city}</span>
                </div>
                <p className="mt-2 text-sm text-white/90 leading-relaxed">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="bg-white/20 backdrop-blur-sm text-xs px-3 py-1 rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button
          disabled={isAnimating || showMatch}
          onClick={() => swipe('left')}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-stone-800 shadow-lg border border-rose-100 dark:border-rose-900 text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-900/20 transition-all active:scale-90"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <button
          disabled={isAnimating || showMatch}
          onClick={() => swipe('right')}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-stone-800 shadow-lg border border-yellow-100 dark:border-yellow-900 text-yellow-500 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-yellow-900/20 transition-all active:scale-90"
        >
          <Star size={24} strokeWidth={2} />
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
        Karte ziehen oder Buttons nutzen
      </p>
    </div>
  );
}

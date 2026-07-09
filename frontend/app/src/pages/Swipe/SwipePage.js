import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AuthHint() {
  return <main className="min-h-screen flex items-center justify-center">Bitte erst einloggen, um zu swipen.</main>;
}

export default function SwipePage() {
  const { isAuthenticated, getDiscovery, swipe } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [matchNotice, setMatchNotice] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let active = true;

    getDiscovery()
      .then((data) => {
        if (active) {
          setCandidates(data);
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

  async function handleSwipe(direction) {
    const candidate = candidates[0];

    if (!candidate) {
      return;
    }

    try {
      const result = await swipe({
        targetUserId: candidate.id,
        direction,
      });

      setCandidates((current) => current.slice(1));
      setStatus(direction === "like" ? `${candidate.username} geliked.` : `${candidate.username} übersprungen.`);
      setMatchNotice(result.isMatch ? `It's a match mit ${candidate.username}.` : "");
    } catch (error) {
      setStatus(error.message);
      setMatchNotice("");
    }
  }

  if (!isAuthenticated) {
    return <AuthHint />;
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Kandidaten werden geladen...</main>;
  }

  const candidate = candidates[0];

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-[#1c1917] rounded-[2rem] shadow-xl border border-stone-200 dark:border-stone-800 p-8">
        <h1 className="text-3xl font-extrabold">Swipe</h1>
        <div className="w-16 h-1.5 bg-[#af6aff] rounded-full mt-3 mb-8" />

        {candidate ? (
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-stone-200 dark:border-stone-700 p-6 bg-stone-50 dark:bg-[#292524]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{candidate.displayName || candidate.firstName || candidate.username}</h2>
                  <p className="text-sm text-black/60 dark:text-white/60">@{candidate.username}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#af6aff]/10 text-[#af6aff] text-xs font-bold uppercase">
                  {candidate.location || "Unbekannt"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6">{candidate.bio || "Noch keine Bio."}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(candidate.interests || []).length > 0 ? (
                  candidate.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-700 text-sm">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-black/50 dark:text-white/50">Keine Interessen hinterlegt.</span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
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
          <p className="text-black/70 dark:text-white/70">Keine weiteren Kandidaten. Leg dir noch ein paar Testuser an 🙂</p>
        )}

        {status ? <p className="mt-6 text-sm text-black/70 dark:text-white/70">{status}</p> : null}
        {matchNotice ? <p className="mt-2 text-sm text-green-600 font-semibold">{matchNotice}</p> : null}
      </div>
    </main>
  );
}

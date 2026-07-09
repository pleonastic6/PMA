import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function MatchesPage() {
  const navigate = useNavigate();
  const { isAuthenticated, getMatches } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let active = true;

    getMatches()
      .then((data) => {
        if (active) {
          setMatches(data);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
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
  }, [isAuthenticated, getMatches]);

  if (!isAuthenticated) {
    return <main className="min-h-screen flex items-center justify-center">Bitte erst einloggen, um Matches zu sehen.</main>;
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Matches werden geladen...</main>;
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold">Matches</h1>
        <div className="w-16 h-1.5 bg-[#af6aff] rounded-full mt-3 mb-8" />

        {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

        {matches.length === 0 ? (
          <p className="text-black/70 dark:text-white/70">Noch keine Matches. Erst swipen, dann knallt's vielleicht.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <div key={match.id} className="rounded-[1.5rem] border border-stone-200 dark:border-stone-700 p-6 bg-white dark:bg-[#1c1917] shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">{match.displayName || match.firstName || match.username}</h2>
                    <p className="text-sm text-black/60 dark:text-white/60">@{match.username}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">
                    Match
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6">{match.bio || "Noch keine Bio."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(match.interests || []).length > 0 ? (
                    match.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-sm">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-black/50 dark:text-white/50">Keine Interessen hinterlegt.</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/chat?user=${match.id}`)}
                  className="mt-6 rounded-2xl bg-[#af6aff] hover:bg-[#9e59eb] text-white font-bold px-4 py-3 transition"
                >
                  Chat starten
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

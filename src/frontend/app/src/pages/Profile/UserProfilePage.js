import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function InfoBlock({ title, children }) {
  if (!children) {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1c1917] p-5 shadow-lg">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-black/75 dark:text-white/75">{children}</div>
    </section>
  );
}

function TagRow({ title, values }) {
  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-black/55 dark:text-white/55">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={`${title}-${value}`} className="rounded-full bg-[#af6aff]/12 px-3 py-1 text-sm font-semibold text-[#7b4bf3] dark:text-[#d4c6ff]">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userId } = useParams();
  const { getUserProfile } = useAuth();
  const [profile, setProfile] = useState(state?.profile || null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(!state?.profile);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state?.profile) {
      return;
    }

    let active = true;
    getUserProfile(userId)
      .then((data) => {
        if (active) {
          setProfile(data);
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
  }, [getUserProfile, state?.profile, userId]);

  useEffect(() => {
    setActiveImage(0);
  }, [profile?.id]);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Profil wird geladen...</main>;
  }

  if (!profile) {
    return <main className="min-h-screen flex items-center justify-center">{error || "Profil nicht gefunden."}</main>;
  }

  const pictures = profile.pictures?.length ? profile.pictures : [null];
  const heroImage = pictures[activeImage];
  const name = profile.displayName || profile.firstName || profile.username;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 dark:border-stone-700 px-4 py-2 font-semibold hover:bg-stone-50 dark:hover:bg-white/5 transition"
        >
          <ArrowLeft size={16} />
          Zurueck
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] overflow-hidden border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1c1917] shadow-xl">
            <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800">
              {heroImage ? (
                <img src={heroImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#af6aff] to-[#5a8dff] text-white text-6xl font-black">
                  {String(name).slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            {pictures.length > 1 ? (
              <div className="p-4 flex gap-3 overflow-x-auto">
                {pictures.map((picture, index) => (
                  <button
                    key={`${profile.id}-picture-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-24 w-20 shrink-0 overflow-hidden rounded-2xl border-2 ${index === activeImage ? "border-[#af6aff]" : "border-transparent"}`}
                  >
                    {picture ? <img src={picture} alt={`${name} ${index + 1}`} className="w-full h-full object-cover" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1c1917] p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black">{name}</h1>
                  <p className="mt-1 text-sm text-black/60 dark:text-white/60">@{profile.username}</p>
                  {profile.location ? (
                    <p className="mt-3 inline-flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
                      <MapPin size={16} />
                      {profile.location}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/chat?user=${profile.id}`)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#af6aff] hover:bg-[#9e59eb] text-white font-bold px-4 py-3 transition"
                >
                  <MessageCircle size={16} />
                  Chat
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <TagRow title="Sprachen" values={profile.languages} />
                <TagRow title="Interessen" values={profile.interests} />
                <TagRow title="Vibe-Tags" values={profile.vibeTags} />
              </div>
            </div>

            <InfoBlock title="Bio">{profile.bio}</InfoBlock>
            <InfoBlock title="Eisbrecher">{profile.icebreaker}</InfoBlock>
            <InfoBlock title="Ueber mich">
              <div className="space-y-3">
                {profile.lookingFor ? <p><strong>Ich suche:</strong> {profile.lookingFor}</p> : null}
                {profile.jobTitle ? <p><strong>Job:</strong> {profile.jobTitle}</p> : null}
                {profile.education ? <p><strong>Ausbildung:</strong> {profile.education}</p> : null}
                {profile.hometown ? <p><strong>Heimatstadt:</strong> {profile.hometown}</p> : null}
                {profile.favoriteHangout ? <p><strong>Lieblingsort fuers erste Treffen:</strong> {profile.favoriteHangout}</p> : null}
                {profile.weekendMood ? <p><strong>Wochenend-Mood:</strong> {profile.weekendMood}</p> : null}
                {profile.idealSunday ? <p><strong>Perfekter Sonntag:</strong> {profile.idealSunday}</p> : null}
                {profile.greenFlags ? <p><strong>Green Flags:</strong> {profile.greenFlags}</p> : null}
                {profile.funFact ? <p><strong>Fun Fact:</strong> {profile.funFact}</p> : null}
              </div>
            </InfoBlock>
          </section>
        </div>
      </div>
    </main>
  );
}

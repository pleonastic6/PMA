import { Compass, Coffee, MapPin, Pencil, Sparkles } from "lucide-react";

import { useAppState } from "../../context/AppStateContext";

export default function Profile() {
  const { userProfile, updateUserProfile, toggleUserListField, availableInterests, availableProfileHighlights } = useAppState();

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 dark:bg-[#0f1115] md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-6">
        <section className="rounded-3xl bg-white p-5 shadow-xl dark:bg-[#181b22] dark:text-white md:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${userProfile.gradient} text-2xl font-black text-white`}>
                {userProfile.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-violet-500">Profile</p>
                <h1 className="text-3xl font-extrabold">{userProfile.name}, {userProfile.age}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{userProfile.tagline}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-200 md:self-auto">
              Profil vollständig · bereit für Discover
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  <Pencil size={18} />
                </div>
                <h2 className="text-xl font-bold">Über dich</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <span className="mb-2 block text-xs uppercase tracking-wide text-gray-400">Name</span>
                  <input
                    value={userProfile.name}
                    onChange={(event) => updateUserProfile("name", event.target.value)}
                    className="w-full bg-transparent text-lg font-semibold outline-none"
                  />
                </label>
                <label className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <span className="mb-2 block text-xs uppercase tracking-wide text-gray-400">Stadt</span>
                  <input
                    value={userProfile.city}
                    onChange={(event) => updateUserProfile("city", event.target.value)}
                    className="w-full bg-transparent text-lg font-semibold outline-none"
                  />
                </label>
                <label className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5 md:col-span-2">
                  <span className="mb-2 block text-xs uppercase tracking-wide text-gray-400">Tagline</span>
                  <input
                    value={userProfile.tagline}
                    onChange={(event) => updateUserProfile("tagline", event.target.value)}
                    className="w-full bg-transparent text-lg font-semibold outline-none"
                  />
                </label>
                <label className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5 md:col-span-2">
                  <span className="mb-2 block text-xs uppercase tracking-wide text-gray-400">Bio</span>
                  <textarea
                    value={userProfile.bio}
                    onChange={(event) => updateUserProfile("bio", event.target.value)}
                    rows={4}
                    className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
                  />
                </label>
                <label className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5 md:col-span-2">
                  <span className="mb-2 block text-xs uppercase tracking-wide text-gray-400">Verfügbarkeit</span>
                  <input
                    value={userProfile.availability}
                    onChange={(event) => updateUserProfile("availability", event.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <Sparkles size={18} />
                </div>
                <h2 className="text-xl font-bold">Interessen</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const active = userProfile.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleUserListField("interests", interest)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white"}`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                  <Compass size={18} />
                </div>
                <h2 className="text-xl font-bold">Wonach suchst du?</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Treffen", "Spaziergänge", "Deep Talks", "Brunch", "Events"].map((value) => {
                  const active = userProfile.lookingFor.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleUserListField("lookingFor", value)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white"}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                  <Coffee size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Profil-Highlights</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wähl 2–4 Dinge, die sofort hängenbleiben.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableProfileHighlights.map((highlight) => {
                  const active = userProfile.highlights?.includes(highlight);
                  return (
                    <button
                      key={highlight}
                      type="button"
                      onClick={() => toggleUserListField("highlights", highlight)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white"}`}
                    >
                      {highlight}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
                <p className="text-sm font-semibold">So wirkt dein Profil gerade</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(userProfile.highlights ?? []).map((highlight) => (
                    <span key={highlight} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
                      {highlight}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-white/80">
                  Direkt, interessiert und offen für gute Gespräche — genau die Art Profil, bei der man gern nach rechts swiped.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
              <h2 className="text-xl font-bold">Profil-Preview</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <MapPin size={16} className="text-violet-500" />
                  <span>{userProfile.city}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <Coffee size={16} className="text-violet-500" />
                  <span>{userProfile.interests.slice(0, 3).join(" · ")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

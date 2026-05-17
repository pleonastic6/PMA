import { Bell, Lock, MapPin, SlidersHorizontal } from "lucide-react";

import { useAppState } from "../../context/AppStateContext";

const radiusOptions = [10, 25, 50];

export default function Settings() {
  const {
    availableInterests,
    preferences,
    setAgeRange,
    setRadiusKm,
    toggleInterestFilter,
    updateNotificationSetting,
    updatePrivacySetting,
  } = useAppState();

  const sections = [
    {
      title: "Benachrichtigungen",
      icon: Bell,
      items: [
        { key: "matches", label: "Neue Matches", description: "Sofort benachrichtigen, wenn es funkt.", scope: "notifications" },
        { key: "events", label: "Event-Empfehlungen", description: "Lokale Events passend zu deinen Interessen.", scope: "notifications" },
      ],
    },
    {
      title: "Privatsphäre",
      icon: Lock,
      items: [
        { key: "showDistance", label: "Distanz anzeigen", description: "Zeigt anderen grob deine Entfernung an.", scope: "privacy" },
        { key: "showActive", label: "Aktivstatus", description: "Lässt andere sehen, ob du gerade online bist.", scope: "privacy" },
      ],
    },
  ];

  const toggle = (scope, key) => {
    if (scope === "notifications") updateNotificationSetting(key);
    if (scope === "privacy") updatePrivacySetting(key);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 dark:bg-[#0f1115] md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-6">
        <section className="rounded-3xl bg-white p-5 shadow-xl dark:bg-[#181b22] dark:text-white md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-violet-500">Settings</p>
              <h1 className="text-3xl font-extrabold">Dein Setup</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Passe Benachrichtigungen, Sichtbarkeit und Entdecken-Einstellungen an.
              </p>
            </div>
            <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
              Profilradius: {preferences.radiusKm} km
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item) => {
                      const enabled = preferences[item.scope][item.key];
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggle(item.scope, item.key)}
                          className="flex w-full items-center justify-between rounded-2xl border border-gray-100 px-4 py-4 text-left transition hover:border-violet-200 hover:bg-violet-50/60 dark:border-white/10 dark:hover:bg-white/5"
                        >
                          <div>
                            <p className="font-semibold">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                          <div className={`h-7 w-12 rounded-full p-1 transition ${enabled ? "bg-violet-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                            <div className={`h-5 w-5 rounded-full bg-white transition ${enabled ? "translate-x-5" : "translate-x-0"}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <MapPin size={18} />
                </div>
                <h2 className="text-xl font-bold">Entdecken</h2>
              </div>

              <div className="space-y-5 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">Distanz</p>
                  <div className="flex flex-wrap gap-2">
                    {radiusOptions.map((radius) => (
                      <button
                        key={radius}
                        type="button"
                        onClick={() => setRadiusKm(radius)}
                        className={`rounded-full px-4 py-2 font-semibold transition ${preferences.radiusKm === radius ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white"}`}
                      >
                        {radius} km
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">Alter</p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
                      <span className="mb-2 block text-xs uppercase tracking-wide text-gray-400">Min</span>
                      <input
                        type="number"
                        min="18"
                        max="99"
                        value={preferences.ageRange[0]}
                        onChange={(event) => setAgeRange(0, Number(event.target.value))}
                        className="w-full bg-transparent text-lg font-semibold outline-none"
                      />
                    </label>
                    <label className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
                      <span className="mb-2 block text-xs uppercase tracking-wide text-gray-400">Max</span>
                      <input
                        type="number"
                        min="18"
                        max="99"
                        value={preferences.ageRange[1]}
                        onChange={(event) => setAgeRange(1, Number(event.target.value))}
                        className="w-full bg-transparent text-lg font-semibold outline-none"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">Interessen</p>
                  <div className="flex flex-wrap gap-2">
                    {availableInterests.map((interest) => {
                      const active = preferences.interestFilters.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterestFilter(interest)}
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white"}`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 p-5 text-white shadow-lg md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <SlidersHorizontal size={18} />
                <h2 className="text-xl font-bold">Live-Effekt</h2>
              </div>
              <p className="text-sm text-white/85">
                Deine Einstellungen wirken direkt auf Swipe, Map und Treffpunkt-Vorschläge. So fühlt sich der Flow über alle Screens konsistent an.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

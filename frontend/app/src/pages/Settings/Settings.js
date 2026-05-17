import { useState } from "react";
import { Bell, Lock, MapPin, SlidersHorizontal } from "lucide-react";

const settingSections = [
  {
    title: "Benachrichtigungen",
    icon: Bell,
    items: [
      { key: "matches", label: "Neue Matches", description: "Sofort benachrichtigen, wenn es funkt." },
      { key: "events", label: "Event-Empfehlungen", description: "Lokale Events passend zu deinen Interessen." },
    ],
  },
  {
    title: "Privatsphäre",
    icon: Lock,
    items: [
      { key: "showDistance", label: "Distanz anzeigen", description: "Zeigt anderen grob deine Entfernung an." },
      { key: "showActive", label: "Aktivstatus", description: "Lässt andere sehen, ob du gerade online bist." },
    ],
  },
];

export default function Settings() {
  const [settings, setSettings] = useState({
    matches: true,
    events: true,
    showDistance: true,
    showActive: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 dark:bg-[#0f1115]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#181b22] dark:text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-violet-500">Settings</p>
              <h1 className="text-3xl font-extrabold">Dein Setup</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Frontend-first: alles als Mock steuerbar, damit das Produktgefühl schon steht.
              </p>
            </div>
            <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
              Profilradius: 25 km
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            {settingSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#181b22] dark:text-white">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleSetting(item.key)}
                        className="flex w-full items-center justify-between rounded-2xl border border-gray-100 px-4 py-4 text-left transition hover:border-violet-200 hover:bg-violet-50/60 dark:border-white/10 dark:hover:bg-white/5"
                      >
                        <div>
                          <p className="font-semibold">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        <div className={`h-7 w-12 rounded-full p-1 transition ${settings[item.key] ? "bg-violet-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                          <div className={`h-5 w-5 rounded-full bg-white transition ${settings[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#181b22] dark:text-white">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <MapPin size={18} />
                </div>
                <h2 className="text-xl font-bold">Entdecken</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="font-semibold text-gray-900 dark:text-white">Ort</p>
                  <p>Berlin Mitte</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="font-semibold text-gray-900 dark:text-white">Altersbereich</p>
                  <p>21 - 29 Jahre</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="font-semibold text-gray-900 dark:text-white">Interessenfokus</p>
                  <p>Tech, Kaffee, Draußen</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <SlidersHorizontal size={18} />
                <h2 className="text-xl font-bold">Nächster Frontend-Step</h2>
              </div>
              <p className="text-sm text-white/85">
                Als Nächstes wären Filter-Chips und ein echtes Preferences-Panel sinnvoll, damit Swipe und Settings zusammenhängen.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

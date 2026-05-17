import { Flame, Heart, MessageCircle, Sparkles, TrendingUp, Users } from "lucide-react";

import { useAppState } from "../../context/AppStateContext";

const toneClasses = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
};

export default function Insights() {
  const { matches, chatMessages, preferences, profiles, userProfile } = useAppState();

  const likesCount = matches.length + 28;
  const chatCount = Object.values(chatMessages).filter((messages) => messages.some((message) => message.author === "me")).length;
  const interestSignals = userProfile.interests.map((interest, index) => ({
    label: interest,
    score: 92 - index * 8,
  }));

  const statCards = [
    { label: "Profile gesehen", value: String(profiles.length), detail: `${preferences.radiusKm} km Radius`, icon: Users, tone: "violet" },
    { label: "Likes verteilt", value: String(likesCount), detail: `${preferences.interestFilters.length} aktive Filter`, icon: Heart, tone: "rose" },
    { label: "Matches", value: String(matches.length), detail: `${matches.filter((match) => match.unread > 0).length} ungelesen`, icon: Sparkles, tone: "amber" },
    { label: "Chats gestartet", value: String(chatCount), detail: `${Object.keys(chatMessages).length} Verläufe`, icon: MessageCircle, tone: "emerald" },
  ];

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 dark:bg-[#0f1115]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#181b22] dark:text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-violet-500">Insights</p>
              <h1 className="text-3xl font-extrabold">Deine Aktivität im Überblick</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Behalte Matches, Likes und Interessen-Signale auf einen Blick im Auge.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <TrendingUp size={16} />
              Engagement steigt
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    <p className="mt-2 text-3xl font-extrabold">{card.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${toneClasses[card.tone]}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{card.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#181b22] dark:text-white">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                <Flame size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Stärkste Interessen-Signale</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Darauf basiert gerade dein Discover-Fokus.</p>
              </div>
            </div>

            <div className="space-y-4">
              {interestSignals.map((signal) => (
                <div key={signal.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold">{signal.label}</span>
                    <span className="text-gray-500 dark:text-gray-400">{signal.score}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-white/10">
                    <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${signal.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#181b22] dark:text-white">
              <h2 className="text-xl font-bold">Quick Wins</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/5">Mehr Interessen im Profil erhöhen die Discover-Relevanz</li>
                <li className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/5">Kurze erste Nachrichten halten Chats aktiver</li>
                <li className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/5">Kleinere Distanzfilter liefern fokussiertere Treffpunkte</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-lg">
              <h2 className="text-xl font-bold">Produktgefühl</h2>
              <p className="mt-3 text-sm text-white/80">
                Deine Screens hängen jetzt sichtbar zusammen: Einstellungen beeinflussen Discover, Discover erzeugt Matches und Matches füttern die Insights.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoaderCircle, MessageCircle, Search, Send, Sparkles } from "lucide-react";

import { useAppState } from "../../context/AppStateContext";

export default function MatchesPage() {
  const location = useLocation();
  const { matches, chatMessages, sendMessage, markMatchRead, typingMatchIds, setActiveMatchId } = useAppState();
  const [activeMatchId, setLocalActiveMatchId] = useState(location.state?.matchId ?? matches[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (location.state?.matchId) {
      setLocalActiveMatchId(location.state.matchId);
    }
  }, [location.state]);

  useEffect(() => {
    if (!activeMatchId && matches[0]) {
      setLocalActiveMatchId(matches[0].id);
    }
  }, [activeMatchId, matches]);

  useEffect(() => {
    setActiveMatchId(activeMatchId ?? null);
    if (activeMatchId) {
      markMatchRead(activeMatchId);
    }
    return () => setActiveMatchId(null);
  }, [activeMatchId, markMatchRead, setActiveMatchId]);

  const activeMatch = useMemo(
    () => matches.find((match) => match.id === activeMatchId) ?? matches[0],
    [activeMatchId, matches]
  );

  const messages = activeMatch ? chatMessages[activeMatch.id] ?? [] : [];
  const isTyping = activeMatch ? typingMatchIds.includes(activeMatch.id) : false;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isTyping, messages.length]);

  const handleSend = () => {
    if (!activeMatch || !draft.trim()) return;
    sendMessage(activeMatch.id, draft);
    setDraft("");
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 dark:bg-[#0f1115] md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-6">
        <section className="rounded-3xl bg-white p-5 shadow-xl dark:bg-[#181b22] dark:text-white md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-violet-500">Matches & Chats</p>
              <h1 className="text-3xl font-extrabold">Deine Gespräche</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Spring direkt in aktive Matches und halte den Flow nach dem Swipe lebendig.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
              <Sparkles size={16} />
              {matches.length} aktive Matches
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl bg-white p-4 shadow-lg dark:bg-[#181b22] dark:text-white md:p-5">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/5">
              <Search size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Wähle ein Match und steig direkt ins Gespräch ein</span>
            </div>

            <div className="space-y-3">
              {matches.map((match) => {
                const isActive = match.id === activeMatch?.id;
                return (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => setLocalActiveMatchId(match.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${isActive ? "bg-violet-50 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:ring-violet-500/30" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${match.gradient} font-bold text-white`}>
                      {match.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold">{match.name}</p>
                        <span className="text-xs text-gray-400">{match.lastActive}</span>
                      </div>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">{match.lastMessage}</p>
                    </div>
                    {match.unread > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-violet-500 px-2 text-xs font-semibold text-white">
                        {match.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-3xl bg-white p-5 shadow-lg dark:bg-[#181b22] dark:text-white md:p-6">
            {activeMatch ? (
              <>
                <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-white/10">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${activeMatch.gradient} font-bold text-white`}>
                    {activeMatch.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{activeMatch.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activeMatch.city} · aktiv {activeMatch.lastActive}</p>
                  </div>
                </div>

                <div className="flex min-h-[420px] flex-col justify-between gap-4">
                  <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1 md:pr-2">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.author === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm md:max-w-[75%] ${message.author === "me"
                          ? "bg-violet-500 text-white"
                          : message.author === "system"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200"
                            : "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white"
                          }`}>
                          <p>{message.text}</p>
                          <p className={`mt-2 text-[11px] ${message.author === "me" ? "text-violet-100" : "text-gray-400 dark:text-gray-500"}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-600 dark:bg-white/10 dark:text-gray-300">
                          <LoaderCircle size={14} className="animate-spin" />
                          {activeMatch.name} tippt...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MessageCircle size={16} />
                      Nachricht an {activeMatch.name} senden
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && handleSend()}
                        placeholder="Schreib eine Nachricht..."
                        className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-[#10131a]"
                      />
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!draft.trim() || isTyping}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 sm:self-auto"
                      >
                        <Send size={16} />
                        Senden
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-center text-gray-500 dark:text-gray-400">
                Noch keine Matches vorhanden.
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

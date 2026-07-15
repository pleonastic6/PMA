import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function formatTime(timestamp) {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const { deleteConversation, getConversations, getMessages, isAuthenticated, sendMessage, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [conversation, setConversation] = useState(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let active = true;

    getConversations()
      .then((data) => {
        if (!active) {
          return;
        }

        setConversations(data);
        const requestedUserId = searchParams.get("user");
        const requestedConversation = requestedUserId
          ? data.find((entry) => entry.user.id === requestedUserId)
          : null;

        if (requestedConversation) {
          setSelectedUserId(requestedConversation.user.id);
        } else if (data[0]) {
          setSelectedUserId(data[0].user.id);
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
  }, [getConversations, isAuthenticated, searchParams]);

  useEffect(() => {
    if (!selectedUserId || !isAuthenticated) {
      setConversation(null);
      return;
    }

    let active = true;

    getMessages(selectedUserId)
      .then((data) => {
        if (active) {
          setConversation(data);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedUserId, isAuthenticated, getMessages]);

  const selectedConversation = useMemo(
    () => conversations.find((entry) => entry.user.id === selectedUserId) || null,
    [conversations, selectedUserId],
  );

  async function handleSend(event) {
    event.preventDefault();
    if (!selectedUserId || !draft.trim()) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const message = await sendMessage(selectedUserId, draft);
      setConversation((current) => ({
        ...(current || {}),
        messages: [...(current?.messages || []), message],
      }));
      setConversations((current) => {
        const updated = current.map((entry) =>
          entry.user.id === selectedUserId
            ? {
                ...entry,
                latestMessage: message,
              }
            : entry,
        );

        return [...updated].sort((left, right) => {
          const leftTimestamp = left.latestMessage?.createdAt ? new Date(left.latestMessage.createdAt).getTime() : 0;
          const rightTimestamp = right.latestMessage?.createdAt ? new Date(right.latestMessage.createdAt).getTime() : 0;

          return rightTimestamp - leftTimestamp;
        });
      });
      setDraft("");
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteConversation() {
    if (!selectedConversation) {
      return;
    }

    const confirmed = window.confirm(`Chat mit ${selectedConversation.user.displayName || selectedConversation.user.username} wirklich loeschen?`);
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteConversation(selectedConversation.user.id);
      setConversation((current) => (current ? { ...current, messages: [] } : current));
      setConversations((current) =>
        current.map((entry) =>
          entry.user.id === selectedConversation.user.id
            ? { ...entry, latestMessage: null }
            : entry,
        ),
      );
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeleting(false);
    }
  }

  if (!isAuthenticated) {
    return <main className="min-h-screen flex items-center justify-center">Bitte erst einloggen, um zu chatten.</main>;
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Chats werden geladen...</main>;
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10 bg-[radial-gradient(circle_at_top_left,_rgba(87,78,255,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,153,102,0.12),_transparent_24%)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <aside className="rounded-[2rem] border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-[#1c1917]/95 shadow-xl p-4 backdrop-blur">
          <div className="mb-4 px-2">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4bf3]">Inbox</p>
            <h1 className="mt-2 text-2xl font-extrabold">Chats</h1>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">Aktive Gespräche stehen automatisch oben.</p>
          </div>

          {conversations.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-stone-300 dark:border-stone-700 p-6 text-sm text-black/60 dark:text-white/60">
              Noch keine Matches fuer Chats.
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((entry) => {
                const isSelected = entry.user.id === selectedUserId;
                const preview = entry.latestMessage?.text || "Noch keine Nachricht";

                return (
                  <button
                    key={entry.user.id}
                    type="button"
                    onClick={() => setSelectedUserId(entry.user.id)}
                    className={`w-full text-left rounded-[1.5rem] p-4 border transition ${
                      isSelected
                        ? "border-[#af6aff] bg-gradient-to-br from-[#af6aff]/14 to-[#ffb36b]/14 shadow-[0_12px_30px_rgba(175,106,255,0.15)]"
                        : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold">{entry.user.displayName || entry.user.firstName || entry.user.username}</div>
                        <div className="text-xs text-black/60 dark:text-white/60">@{entry.user.username}</div>
                      </div>
                      <span className="text-[11px] text-black/45 dark:text-white/45">{formatTime(entry.latestMessage?.createdAt)}</span>
                    </div>
                    <div className="mt-3 text-sm text-black/70 dark:text-white/70 truncate">{preview}</div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="rounded-[2rem] border border-stone-200 dark:border-stone-700 bg-white/92 dark:bg-[#1c1917]/96 shadow-xl backdrop-blur min-h-[72vh] flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              <header className="px-6 py-5 border-b border-stone-200 dark:border-stone-700 bg-gradient-to-r from-[#574EFF] via-[#7B7DFF] to-[#ff9f6e] text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/75">Chat</p>
                    <h2 className="mt-2 text-2xl font-extrabold">
                      {selectedConversation.user.displayName || selectedConversation.user.firstName || selectedConversation.user.username}
                    </h2>
                    <p className="mt-1 text-sm text-white/80">@{selectedConversation.user.username}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteConversation}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {deleting ? "Loesche..." : "Chat loeschen"}
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-auto px-6 py-6 bg-[radial-gradient(circle_at_top,_rgba(175,106,255,0.08),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.96))] dark:bg-[radial-gradient(circle_at_top,_rgba(175,106,255,0.12),_transparent_35%),linear-gradient(180deg,rgba(28,25,23,0.82),rgba(28,25,23,0.98))]">
                {(conversation?.messages || []).length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="max-w-md rounded-[1.75rem] border border-dashed border-stone-300 dark:border-stone-700 bg-white/70 dark:bg-white/5 px-6 py-8 text-center">
                      <MessageCircle className="mx-auto mb-4 text-[#7b4bf3]" size={34} />
                      <p className="font-semibold">Noch leer, aber nicht tot.</p>
                      <p className="mt-2 text-sm text-black/60 dark:text-white/60">Schreib die erste Nachricht und mach es weniger awkward.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation.messages.map((message) => {
                      const ownMessage = String(message.senderUserId) === String(user?.id);

                      return (
                        <div key={message.id} className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}>
                          <div className="max-w-[78%]">
                            <div
                              className={`rounded-[1.4rem] px-4 py-3 shadow-sm ${
                                ownMessage
                                  ? "bg-gradient-to-br from-[#6c3ef0] to-[#8c67ff] text-white shadow-[0_10px_25px_rgba(108,62,240,0.28)]"
                                  : "bg-white dark:bg-stone-800 text-black dark:text-white border border-stone-200 dark:border-stone-700"
                              }`}
                            >
                              <p className={ownMessage ? "text-white" : "text-black dark:text-white"}>{message.text}</p>
                            </div>
                            <p className={`mt-1 text-[11px] ${ownMessage ? "text-right text-black/45 dark:text-white/45" : "text-left text-black/45 dark:text-white/45"}`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-[#161312]">
                <div className="flex gap-3 rounded-[1.75rem] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#221f1d] p-2 shadow-sm">
                  <input
                    className="flex-1 bg-transparent px-4 py-3 outline-none"
                    placeholder="Nachricht schreiben..."
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 rounded-[1.2rem] bg-[#af6aff] hover:bg-[#9e59eb] text-white font-bold px-5 py-3 disabled:opacity-60"
                  >
                    <Send size={16} />
                    {sending ? "..." : "Senden"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-black/60 dark:text-white/60">
              Match auswaehlen und losschreiben.
            </div>
          )}
          {error ? <p className="px-6 py-4 text-sm text-red-600">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}

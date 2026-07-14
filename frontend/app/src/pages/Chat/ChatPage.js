import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, getConversations, getMessages, sendMessage } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [conversation, setConversation] = useState(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
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
  }, [isAuthenticated, getConversations, searchParams]);

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
      setConversations((current) =>
        current.map((entry) =>
          entry.user.id === selectedUserId
            ? {
                ...entry,
                latestMessage: message,
              }
            : entry,
        ),
      );
      setDraft("");
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setSending(false);
    }
  }

  if (!isAuthenticated) {
    return <main className="min-h-screen flex items-center justify-center">Bitte erst einloggen, um zu chatten.</main>;
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Chats werden geladen...</main>;
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="rounded-[1.5rem] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1c1917] shadow-lg p-4">
          <h1 className="text-2xl font-extrabold mb-4">Chats</h1>
          {conversations.length === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/60">Noch keine Matches für Chats.</p>
          ) : (
            <div className="space-y-2">
              {conversations.map((entry) => (
                <button
                  key={entry.user.id}
                  type="button"
                  onClick={() => setSelectedUserId(entry.user.id)}
                  className={`w-full text-left rounded-2xl p-4 border transition ${
                    entry.user.id === selectedUserId
                      ? "border-[#af6aff] bg-[#af6aff]/10"
                      : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"
                  }`}
                >
                  <div className="font-bold">{entry.user.displayName || entry.user.firstName || entry.user.username}</div>
                  <div className="text-xs text-black/60 dark:text-white/60">@{entry.user.username}</div>
                  <div className="text-sm mt-2 text-black/70 dark:text-white/70 truncate">
                    {entry.latestMessage?.text || "Noch keine Nachricht"}
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="rounded-[1.5rem] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1c1917] shadow-lg p-6 flex flex-col min-h-[70vh]">
          {selectedConversation ? (
            <>
              <header className="pb-4 border-b border-stone-200 dark:border-stone-700">
                <h2 className="text-2xl font-extrabold">
                  {selectedConversation.user.displayName || selectedConversation.user.firstName || selectedConversation.user.username}
                </h2>
                <p className="text-sm text-black/60 dark:text-white/60">@{selectedConversation.user.username}</p>
              </header>

              <div className="flex-1 py-6 space-y-3 overflow-auto">
                {(conversation?.messages || []).length === 0 ? (
                  <p className="text-sm text-black/60 dark:text-white/60">Noch keine Nachrichten. Schreib die erste.</p>
                ) : (
                  conversation.messages.map((message) => {
                    const ownMessage = String(message.senderUserId) === String(user?.id);

                    return (
                      <div key={message.id} className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            ownMessage
                              ? "bg-[#6c3ef0] text-white shadow-[0_8px_24px_rgba(108,62,240,0.28)]"
                              : "bg-stone-100 dark:bg-stone-800 text-black dark:text-white"
                          }`}
                        >
                          <p className={ownMessage ? "text-white" : "text-black dark:text-white"}>{message.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="pt-4 border-t border-stone-200 dark:border-stone-700 flex gap-3">
                <input
                  className="flex-1 rounded-2xl border border-stone-300 dark:border-stone-700 bg-transparent px-4 py-3 outline-none"
                  placeholder="Nachricht schreiben..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-2xl bg-[#af6aff] hover:bg-[#9e59eb] text-white font-bold px-5 py-3 disabled:opacity-60"
                >
                  {sending ? "..." : "Senden"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-black/60 dark:text-white/60">
              Match auswählen und losschreiben.
            </div>
          )}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}

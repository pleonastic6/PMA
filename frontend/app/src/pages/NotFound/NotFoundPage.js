import { Link } from "react-router-dom";
import { Compass, Home, Undo2 } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 dark:bg-[#0f1115]">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-xl dark:bg-[#181b22] dark:text-white">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          <Compass size={34} />
        </div>
        <p className="text-sm font-medium text-violet-500">404</p>
        <h1 className="mt-2 text-4xl font-extrabold">Hier ist gerade nix.</h1>
        <p className="mt-4 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          Die Route existiert im Frontend-Prototyp noch nicht oder du bist falsch abgebogen. Ist nicht dramatisch — wir schicken dich zurück auf sinnvolle Pfade.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600">
            <Home size={16} />
            Zur Startseite
          </Link>
          <Link to="/swipe" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5">
            <Undo2 size={16} />
            Zurück zu Swipe
          </Link>
        </div>
      </div>
    </main>
  );
}

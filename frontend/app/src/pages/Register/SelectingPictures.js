import { NavLink, useNavigate } from "react-router-dom";
import { CheckCircle2, ImagePlus } from "lucide-react";

import { useAppState } from "../../context/AppStateContext";
import { useAuth } from "../../context/AuthContext";

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Profil" },
  { id: 3, label: "Bilder" },
];

function Stepper({ currentStep }) {
  return (
    <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-1">
      {steps.map((step) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;
        return (
          <div key={step.id} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${active ? "bg-violet-500 text-white" : done ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-300"}`}>
            {done ? <CheckCircle2 size={14} /> : <span>{step.id}</span>}
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function SelectingPictures() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { onboarding, updateOnboardingField, completeOnboarding } = useAppState();

  const updatePicture = (index, value) => {
    const next = [...onboarding.pictures];
    next[index] = value || `Bild ${index + 1}`;
    updateOnboardingField("pictures", next);
  };

  const filledSlots = onboarding.pictures.filter(Boolean).length;

  const handleFinish = () => {
    completeOnboarding();
    login();
    navigate("/swipe");
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 dark:bg-[#0f1115] md:py-8">
      <div className="mx-auto flex max-w-4xl justify-center">
        <div className="w-full rounded-3xl bg-white p-5 shadow-xl dark:bg-[#181b22] dark:text-white md:p-8">
          <Stepper currentStep={3} />

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">Lade deine Bilder hoch</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Drei gute Slots reichen schon, damit das Profil nicht leer aussieht.</p>
              <div className="relative mt-3 h-1 w-12 rounded bg-gradient-to-r from-[#af6aff] to-[#df78ff41]" />
            </div>
            <NavLink to="/CreatingProfile" className="text-sm font-semibold text-violet-500">Zurück</NavLink>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <label key={index} className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-violet-300 dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex min-h-24 items-center justify-center rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm dark:bg-[#10131a] dark:text-gray-400">
                  {onboarding.pictures[index] ? onboarding.pictures[index] : <span className="inline-flex items-center gap-2"><ImagePlus size={16} /> Bild wählen</span>}
                </div>
                <span className="mb-2 block text-sm font-semibold">Slot {index + 1}</span>
                <input type="file" accept="image/*" onChange={(e) => updatePicture(index, e.target.files?.[0]?.name)} className="w-full text-xs" />
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-violet-50 p-4 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
            {filledSlots}/3 Slots gefüllt · dein Profil wird direkt mit deinen Angaben aus dem Onboarding vorbelegt.
          </div>

          <div className="mt-6 flex justify-stretch sm:justify-end">
            <button onClick={handleFinish} className="w-full rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 sm:w-auto">
              Profil fertigstellen
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

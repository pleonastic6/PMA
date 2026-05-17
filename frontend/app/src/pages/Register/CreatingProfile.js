import { NavLink } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { availableInterests } from "../../data/appData";
import { useAppState } from "../../context/AppStateContext";

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

function Field({ label, value, onChange }) {
  return (
    <label className="block rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
      <span className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <input value={value} onChange={onChange} className="w-full bg-transparent text-sm outline-none" />
    </label>
  );
}

export default function CreatingProfile() {
  const { onboarding, updateOnboardingField, toggleOnboardingInterest } = useAppState();
  const selectedInterests = onboarding.interestsText.split(",").map((entry) => entry.trim()).filter(Boolean);
  const canContinue = onboarding.firstName.trim() && onboarding.biography.trim() && selectedInterests.length > 0;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 dark:bg-[#0f1115] md:py-8">
      <div className="mx-auto flex max-w-4xl justify-center">
        <div className="w-full rounded-3xl bg-white p-5 shadow-xl dark:bg-[#181b22] dark:text-white md:p-8">
          <Stepper currentStep={2} />

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold">Erzähl etwas über dich</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Ein paar gute Signale reichen schon, damit dein Profil lebendig wirkt.</p>
            <div className="relative mt-3 h-1 w-12 rounded bg-gradient-to-r from-[#af6aff] to-[#df78ff41]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="First Name" value={onboarding.firstName} onChange={(e) => updateOnboardingField("firstName", e.target.value)} />
            <Field label="Last Name" value={onboarding.lastName} onChange={(e) => updateOnboardingField("lastName", e.target.value)} />
            <label className="block rounded-2xl bg-gray-50 p-4 dark:bg-white/5 md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">Biography</span>
              <textarea
                value={onboarding.biography}
                onChange={(e) => updateOnboardingField("biography", e.target.value)}
                rows={6}
                className="w-full resize-none bg-transparent text-sm outline-none"
              />
            </label>
            <label className="block rounded-2xl bg-gray-50 p-4 dark:bg-white/5 md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">Interests</span>
              <input
                value={onboarding.interestsText}
                onChange={(e) => updateOnboardingField("interestsText", e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Tech, Kaffee, Reisen"
              />
            </label>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Schnellauswahl</p>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleOnboardingInterest(interest)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white"}`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <NavLink to="/Register" className="text-sm font-semibold text-violet-500">Zurück</NavLink>
            <NavLink to="/SelectingPictures" aria-disabled={!canContinue} className={`rounded-2xl px-5 py-3 text-center text-sm font-semibold text-white transition ${canContinue ? "bg-violet-500 hover:bg-violet-600" : "pointer-events-none bg-gray-300 text-gray-100 dark:bg-gray-700"}`}>
              Weiter
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
}

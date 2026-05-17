import { NavLink } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

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

function DateInput({ label, value, onChange }) {
  return (
    <label className="block rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
      <span className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <input type="date" value={value} onChange={onChange} className="w-full bg-transparent text-sm outline-none" />
    </label>
  );
}

function RadioBtn({ id, text, group, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input id={id} type="radio" name={group} value={id} checked={checked} onChange={onChange} className="accent-violet-500" />
      <span>{text}</span>
    </label>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
      <span className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <input value={value} type={type} onChange={onChange} className="w-full bg-transparent text-sm outline-none" />
    </label>
  );
}

export default function Register() {
  const { onboarding, updateOnboardingField } = useAppState();
  const canContinue = onboarding.username.trim() && onboarding.password.trim() && onboarding.location.trim() && onboarding.gender;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 dark:bg-[#0f1115] md:py-8">
      <div className="mx-auto flex max-w-3xl justify-center">
        <div className="w-full rounded-3xl bg-white p-5 shadow-xl dark:bg-[#181b22] dark:text-white md:p-8">
          <Stepper currentStep={1} />

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold">Account anlegen</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Erst die Basics, dann geht’s direkt in dein Profil.</p>
            <div className="relative mt-3 h-1 w-12 rounded bg-gradient-to-r from-[#af6aff] to-[#df78ff41]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Username" value={onboarding.username} onChange={(e) => updateOnboardingField("username", e.target.value)} />
            <Field label="Standort" value={onboarding.location} onChange={(e) => updateOnboardingField("location", e.target.value)} />
            <Field label="Passwort" type="password" value={onboarding.password} onChange={(e) => updateOnboardingField("password", e.target.value)} />
            <Field label="Passwort wiederholen" type="password" value={onboarding.password} onChange={(e) => updateOnboardingField("password", e.target.value)} />
            <DateInput label="Geburtstag" value={onboarding.birthday} onChange={(e) => updateOnboardingField("birthday", e.target.value)} />
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
              <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
              <div className="flex flex-wrap gap-4">
                <RadioBtn id="male" text="Male" group="gender" checked={onboarding.gender === "male"} onChange={(e) => updateOnboardingField("gender", e.target.value)} />
                <RadioBtn id="female" text="Female" group="gender" checked={onboarding.gender === "female"} onChange={(e) => updateOnboardingField("gender", e.target.value)} />
                <RadioBtn id="none" text="Weihnachtsmann" group="gender" checked={onboarding.gender === "none"} onChange={(e) => updateOnboardingField("gender", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">Pflichtfelder: Username, Standort, Passwort, Gender</p>
            <NavLink to="/CreatingProfile" aria-disabled={!canContinue} className={`rounded-2xl px-5 py-3 text-center text-sm font-semibold text-white transition ${canContinue ? "bg-violet-500 hover:bg-violet-600" : "pointer-events-none bg-gray-300 text-gray-100 dark:bg-gray-700"}`}>
              Weiter
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
}

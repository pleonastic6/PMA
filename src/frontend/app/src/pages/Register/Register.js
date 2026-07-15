import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Lock, User2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  username: "",
  firstName: "",
  password: "",
  repeatPassword: "",
  birthDate: "",
};

function Field({ label, value, onChange, placeholder, type = "text", icon = null, inputMode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      <div className="relative">
        {icon ? <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
          className={`w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-3 outline-none focus:ring-2 focus:ring-[#6c3ef0] transition ${icon ? "pl-11 pr-4" : "px-4"}`}
        />
      </div>
    </label>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { completeRegistration } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleContinue(event) {
    event.preventDefault();

    if (form.username.trim().length < 3) {
      setError("Username muss mindestens 3 Zeichen lang sein.");
      return;
    }

    if (!form.firstName.trim()) {
      setError("Vorname fehlt.");
      return;
    }

    if (form.password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (form.password !== form.repeatPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    if (!form.birthDate) {
      setError("Geburtsdatum fehlt.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await completeRegistration({
        username: form.username,
        firstName: form.firstName,
        password: form.password,
        birthDate: form.birthDate,
      });
      navigate("/profile");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <form className="w-full max-w-xl rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1C1E]" onSubmit={handleContinue}>
        <div className="bg-gradient-to-r from-[#574EFF] to-[#7B7DFF] p-8 text-white">
          <h1 className="text-3xl font-bold">Account erstellen</h1>
          <p className="mt-2 text-white/90">Kurz registrieren, Profil danach in Ruhe ausbauen.</p>
        </div>

        <div className="p-8 space-y-6">
          <Field
            label="Username"
            value={form.username}
            onChange={(event) => updateField("username", event.target.value)}
            placeholder="deinname"
            icon={<User2 size={16} />}
          />
          <Field
            label="Vorname"
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            placeholder="Wie sollen wir dich ansprechen?"
            icon={<User2 size={16} />}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Passwort"
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Mindestens 8 Zeichen"
              icon={<Lock size={16} />}
            />
            <Field
              label="Passwort wiederholen"
              type="password"
              value={form.repeatPassword}
              onChange={(event) => updateField("repeatPassword", event.target.value)}
              placeholder="Nochmal eingeben"
              icon={<Lock size={16} />}
            />
          </div>
          <Field
            label="Geburtsdatum"
            type="date"
            value={form.birthDate}
            onChange={(event) => updateField("birthDate", event.target.value)}
            icon={<CalendarDays size={16} />}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#6c3ef0] hover:bg-[#5d33d2] text-white font-black px-6 py-4 transition disabled:opacity-60"
          >
            {submitting ? "Erstellt..." : "Account erstellen"}
          </button>
        </div>
      </form>
    </main>
  );
}

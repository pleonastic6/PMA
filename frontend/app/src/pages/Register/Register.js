import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModernInput from "../../components/form_elements/ModernInput";

const initialForm = {
  username: "",
  password: "",
  repeatPassword: "",
  birthDate: "",
  gender: "male",
  location: "",
};

function DateInput({ text, value, onChange, id }) {
  return (
    <div className="flex">
      <label htmlFor={id} className="ml-2 text">
        {text}
      </label>
      <input id={id} type="date" value={value} onChange={onChange} className="bg ml-auto" />
    </div>
  );
}

function RadioBtn({ id, text, group, checked, onChange }) {
  return (
    <div>
      <input id={id} type="radio" name={group} value={id} className="radio" checked={checked} onChange={onChange} />
      <label htmlFor={id}>{text}</label>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const storedPreferences = JSON.parse(sessionStorage.getItem("pma_match_preferences") || "null");

    return {
      ...initialForm,
      gender: storedPreferences?.gender || initialForm.gender,
    };
  });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleContinue(event) {
    event.preventDefault();

    if (form.password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (form.password !== form.repeatPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    setError("");
    sessionStorage.setItem("pma_registration_step1", JSON.stringify(form));
    navigate("/CreatingProfile");
  }

  return (
    <main>
      <div className="flex justify-center">
        <form className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16" onSubmit={handleContinue}>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-extrabold">Register</h1>
              <div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" />
            </div>
            <ModernInput text="Username" id="usernameI" value={form.username} onChange={(e) => updateField("username", e.target.value)} />
            <ModernInput text="Password" input="password" id="passwordI" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
            <ModernInput text="Repeat Password" input="password" id="passwordRepeat" value={form.repeatPassword} onChange={(e) => updateField("repeatPassword", e.target.value)} />
            <DateInput text="Birthday" id="birthdayI" value={form.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} />
            <div className="mx-2 text">
              <p className="mb-1">Gender</p>
              <div className="flex justify-between gap-4">
                <RadioBtn id="male" text="Male" group="gender" checked={form.gender === "male"} onChange={(e) => updateField("gender", e.target.value)} />
                <RadioBtn id="female" text="Female" group="gender" checked={form.gender === "female"} onChange={(e) => updateField("gender", e.target.value)} />
                <RadioBtn id="other" text="Other" group="gender" checked={form.gender === "other"} onChange={(e) => updateField("gender", e.target.value)} />
              </div>
            </div>
            <ModernInput text="Location" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end">
              <button type="submit">continue</button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

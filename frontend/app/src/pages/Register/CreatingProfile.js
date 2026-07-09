import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModernInput from "../../components/form_elements/ModernInput";

function ContinueBtn() {
  return (
    <div className="flex justify-end">
      <button type="submit">continue</button>
    </div>
  );
}

export function ModernTextarea({ className = "", text, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative w-80">
      <label
        className={`
          bg absolute left-3 px-1 pointer-events-none
          transition-transform duration-200 ease-in-out
          ${isActive ? "top-[-8px] text-xs text-blue-500" : "top-4 text"}
        `}
      >
        {text}
      </label>

      <textarea
        className={`
          w-full rounded-lg border border-gray-300 dark:border-gray-400
          px-3 pt-5 pb-2 text-base bg-inherit
          outline-none transition-colors duration-200
          ${className}
        `}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={200}
        style={{ height: 200 }}
      />
    </div>
  );
}

export default function CreatingProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const stored = sessionStorage.getItem("pma_registration_step2");
    return stored
      ? JSON.parse(stored)
      : {
          firstName: "",
          lastName: "",
          bio: "",
          interests: "",
        };
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleContinue(event) {
    event.preventDefault();
    sessionStorage.setItem("pma_registration_step2", JSON.stringify(form));
    navigate("/SelectingPictures");
  }

  return (
    <main>
      <div className="flex justify-center">
        <form className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16" onSubmit={handleContinue}>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-extrabold">Now something about you</h1>
              <div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" />
            </div>
            <ModernInput text="First Name" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
            <ModernInput text="Last Name" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            <ModernTextarea text="Biography" value={form.bio} onChange={(e) => updateField("bio", e.target.value)} />
            <ModernInput text="Interests" value={form.interests} onChange={(e) => updateField("interests", e.target.value)} />
            <ContinueBtn />
          </div>
        </form>
      </div>
    </main>
  );
}

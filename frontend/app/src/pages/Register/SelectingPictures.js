import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function fileNameOrEmpty(file) {
  return file ? file.name : "";
}

export default function SelectingPictures() {
  const navigate = useNavigate();
  const { completeRegistration } = useAuth();
  const [pictures, setPictures] = useState(["", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updatePicture(index, file) {
    setPictures((current) => current.map((entry, currentIndex) => (currentIndex === index ? fileNameOrEmpty(file) : entry)));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const step1 = JSON.parse(sessionStorage.getItem("pma_registration_step1") || "null");
    const step2 = JSON.parse(sessionStorage.getItem("pma_registration_step2") || "null");

    if (!step1 || !step2) {
      setError("Die Registrierung ist unvollständig. Bitte starte neu.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await completeRegistration({
        username: step1.username,
        password: step1.password,
        birthDate: step1.birthDate,
        gender: step1.gender,
        location: step1.location,
        firstName: step2.firstName,
        lastName: step2.lastName,
        bio: step2.bio,
        interests: step2.interests
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
        pictures: pictures.filter(Boolean),
      });

      sessionStorage.removeItem("pma_registration_step1");
      sessionStorage.removeItem("pma_registration_step2");
      navigate("/profile");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="flex justify-center">
        <form className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-extrabold">Load up your pictures</h1>
              <div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" />
            </div>
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={(e) => updatePicture(index, e.target.files?.[0])} />
                {pictures[index] ? <span className="text-sm text-black/60">{pictures[index]}</span> : null}
              </div>
            ))}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end">
              <button type="submit" disabled={submitting}>
                {submitting ? "creating..." : "finish"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

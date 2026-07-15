import { Button } from "../../components/buttons/Button";
import ModernInput from "../../components/form_elements/ModernInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginIllustration from "../../assets/images/ill_2.svg";
import { useAuth } from "../../context/AuthContext";

const logins = ["google", "paypal", "pornhub"];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({ username, password });
      navigate("/profile");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="w-full">
      <div className="flex justify-center">
        <form className="flex overflow-hidden rounded-md my-32 shadow-lg" onSubmit={handleSubmit}>
          <div className="bg-violet-900 w-64 text-stone-100 text-center">
            <img src={loginIllustration} alt="" draggable="false" className="w-full h-full object-cover p-6" />
          </div>
          <div className="flex flex-col p-8">
            <h1 className="text-3xl font-extrabold">Login</h1>
            <p className="text-black/70 text-sm mt-2">Please enter your login information</p>
            <div className="flex flex-col gap-6 mt-2">
              <ModernInput text="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <ModernInput input="password" text="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex gap-1">
              <input id="remember" type="checkbox" className="accent-[#1E1B4B]" />
              <label htmlFor="remember" className="text-sm select-none py-2 text-black/70">Remember me</label>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button text={submitting ? "Logging in..." : "Log In"} type="submit" disabled={submitting} />
            <p className="text-sm mt-4 text-black/70">Don't have an account yet? <Link to="/signup" className="text-blue-500">Register here</Link></p>
            <div className="flex justify-center gap-4 mt-6">
              {logins.map((name) => (
                <button key={name} type="button" className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors px-4">
                  <img src={`/logos/${name}.png`} alt={name} className="size-12" />
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

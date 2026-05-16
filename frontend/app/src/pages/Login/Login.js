import { Button } from "../../components/buttons/Button";
import ModernInput from "../../components/form_elements/ModernInput";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import img_epstein from "../../assets/images/epstein.webp"

const logins = ["google", "paypal", "pornhub"]

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    login();
    navigate("/swipe");
  };

  return (
    <main className="w-full">
      <div className="flex justify-center">
        <div className="flex overflow-hidden rounded-md my-32 shadow-lg">
          <div className="bg-violet-900 w-64 text-stone-100 text-center">
            <img src={img_epstein} draggable="false" className="w-full h-full object-cover object-[-320px]" />
          </div>
          <div className="flex flex-col p-8">
            <h1 className="text-3xl font-extrabold">Login</h1>
            <p className="text-black/70 text-sm mt-2">Please enter your login information</p>
            <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-2">
              <ModernInput text="Username" />
              <ModernInput input="password" text="Password" />
              <div className="flex gap-1">
                <input id="remember" type="checkbox" className="accent-[#1E1B4B]" />
                <label htmlFor="remember" className="text-sm select-none py-2 text-black/70">Remember me</label>
              </div>
              <Button text="Log In" />
            </form>
            <p className="text-sm mt-4 text-black/70">
              Don't have an account yet? <a href="/signup" className="text-blue-500">Register here</a>
            </p>
            <div className="flex justify-center gap-4 mt-6">
              {logins.map((name) =>
                <button key={name} onClick={handleLogin} className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors px-4">
                  <img src={"/logos/" + name + ".png"} className="size-12" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
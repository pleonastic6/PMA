import { Button } from "../../components/buttons/Button";
import { Divider } from "../../components/form_elements/divider";
import ModernInput from "../../components/form_elements/ModernInput";
import { useState } from "react";
import img_epstein from "../../assets/images/epstein.webp"

const strings = {
  "login": "Glad to see you again",
  "register": "Welcome to Epstein Tinder. Once you're in, you'll never get out (unless your age is above 14)"
}

const logins = ["google", "paypal", "pornhub"]


export default function Login() {

  const [action, setAction] = useState("login")

  return (
    <main className="w-full">
      <div className="flex justify-center">
        <div className="flex overflow-hidden rounded-2xl my-32 shadow-2xl">
          {/* Left Panel */}
          <div className="flex flex-col justify-evenly bg-violet-900 w-64 text-stone-100 text-center">
            <img src={img_epstein} className="m-6"/>
            <p className="mx-4">{strings[action]}</p>
          </div>

          {/* Login/Register Form */}
          <div className="flex flex-col p-8">
            <h1 className="text-center text-3xl font-extrabold">Login</h1>
            <ModernInput text="Username"/>
            <ModernInput input="password" text="Password" />
            <Button text="Log In" />
            <Divider text="Login via" />
            <div className="flex justify-center gap-6 mt-6">
              {logins.map((name) => 
                  <button className="p-2 rounded-xl shadow-lg">
                    <img src={"/logos/" + name + ".png"} className="size-12" />
                  </button>
                )}
            </div>
            <p className="text-center text-sm mt-12">Don't have an account yet? <span className="text-blue-500 cursor-pointer">Register here</span></p>
          </div>
        </div>
      </div>
    </main>
  );
}
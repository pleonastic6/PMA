import { Button } from "../../components/buttons/Button";
import { Divider } from "../../components/form_elements/Divider";
import ModernInput from "../../components/form_elements/ModernInput";
import { useState } from "react";
import img_epstein from "../../assets/images/epstein.webp"


const logins = ["google", "paypal", "pornhub"]


export default function Login() {
  return (
    <main className="w-full">
      <div className="flex justify-center">
        <div className="flex overflow-hidden rounded-2xl my-32 shadow-2xl">
          {/* Left Panel */}
          <div className="bg-violet-900 w-64 text-stone-100 text-center">
            <img src={img_epstein} className="w-full h-full object-cover object-[-320px]"/>
          </div>

          {/* Login/Register Form */}
          <div className="flex flex-col p-8">
            <h1 className="text-center text-3xl font-extrabold">Login</h1>
            <ModernInput text="Username"/>
            <ModernInput input="password" text="Password" />
            <div className="flex gap-1">
              <input id="remember" type="checkbox" />
              <label for="remember" className="text-sm select-none py-2" >Remember me</label>
            </div>
            <Button text="Log In" />
            <p className="text-sm mt-4">Don't have an account yet? <a href="/signup" className="text-blue-500">Register here</a></p>
            <Divider text="Login via" />
            <div className="flex justify-center gap-6 mt-6">
              {logins.map((name) => 
                  <button className="p-2 rounded-xl shadow-[0px_0px_8px_-4px_#000000]">
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
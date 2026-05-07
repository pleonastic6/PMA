import { useState } from "react";
import woman from "../../../assets/images/woman.svg"; // Pfad ggf. anpassen

export default function CtaSection() {
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Username submitted:", username);
    };

    return (
        <section className="relative w-full dark:bg-[#0C0E28] bg-[#C8D3FE] py-16 px-6 md:px-12 overflow-hidden">

            <div className="flex-1 flex flex-col items-center justify-center w-full z-10 md:pr-10">

                <h2 className="text-5xl md:text-6xl font-extrabold text-[#384063] mb-4 text-center">
                    What are you waiting for
                </h2>
                <p className="text-xl text-[#5F6689] mb-12 text-center max-w-lg">
                    Join our community and find your soulmate today
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center w-full max-w-2xl bg-white rounded-full p-2 shadow-sm"
                >
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="enter your username"
                        className="flex-1 px-8 bg-transparent outline-none text-slate-700 placeholder-slate-300 font-light text-lg min-w-0"
                    />
                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className={`relative flex h-[50px] w-40 items-center justify-center overflow-hidden rounded-full transition-colors ${!username.trim()
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Ausgegrauter Zustand
                                : "bg-gradient-to-r from-[#917DFF] to-[#5F59FF] text-white before:absolute before:h-0 before:w-0 before:rounded-full before:bg-emerald-300/30 before:transition-all before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56" // Aktiver Zustand
                            }`}
                    >
                        <span className="relative z-10">continue</span>
                    </button>
                </form>
            </div>
            <img
                src={woman}
                alt="Woman"
                className="absolute right-0 -translate-y-2/3 z-0"
            />
        </section>
    );
}

import { useState } from 'react';
import heroIllustration from '../../../assets/images/ill_1.svg';
import { Dropdown } from '../../../components/buttons/Dropdown';

export default function HeroSection() {
    const [gender, setGender] = useState("");
    const [interest, setInterests] = useState("");

    const isButtonDisabled = !gender || !interest;
    return (
        <section className="flex flex-col items-center justify-center w-full bg-white py-20 px-4 text-center">

            <h1 className="text-5xl font-extrabold text-slate-800 mb-4">
                Make new contacts <br /> around the world
            </h1>
            <p className="text-gray-500 mb-10 max-w-lg mx-auto">
                meet real people with this is just a description to describe what's going on here
            </p>
            <div className="flex items-center gap-4 bg-white shadow-lg rounded-full px-6 py-2 mb-16">
                <Dropdown text={"I am"} items={["Male", "Female", "Neutral"]} value={gender} onChange={setGender} />
                <Dropdown text={"looking for"} items={["Male", "Female", "Neutral"]} value={interest} onChange={setInterests} />
                <button
                    disabled={isButtonDisabled}
                    className={`relative flex h-[50px] w-40 items-center justify-center overflow-hidden rounded-full transition-colors ${isButtonDisabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#917DFF] to-[#5F59FF] text-white before:absolute before:h-0 before:w-0 before:rounded-full before:bg-emerald-300/30 before:transition-all before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56" // Zustand: Aktiv mit Animation
                        }`}
                >
                    <span className="relative z-10">continue</span>
                </button>
            </div>
            <div className="w-full max-w-2xl mt-8">
                <img
                    src={heroIllustration}
                    alt="Illustration von Leuten die chatten"
                    className="w-full h-auto drop-shadow-xl"
                />
            </div>

        </section>
    );
}
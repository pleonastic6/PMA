
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from '../../../components/buttons/Dropdown';
import bg from "../../../assets/images/bg_1.svg";
import ico_1 from "../../../assets/images/ico_1.svg";
import CardDropshadow from '../../../components/cards/Card_Dropshadow';
import { useAuth } from '../../../context/AuthContext';

export default function HeroSection() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [gender, setGender] = useState("");
    const [interest, setInterests] = useState("");

    const isButtonDisabled = !gender || !interest;

    function handleContinue() {
        if (isButtonDisabled) {
            return;
        }

        navigate(isAuthenticated ? "/swipe" : "/signup");
    }

    return (
        <section
            className="relative flex flex-col items-center justify-center w-full py-20 px-4 text-center bg-repeat bg-center"
        >
            <div
                className="absolute inset-0 bg-repeat bg-center opacity-100 dark:opacity-20 pointer-events-none z-0 transition-opacity duration-300"
                style={{ backgroundImage: `url(${bg})` }}
            />
            <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="font-extrabold  mb-4">
                    Make new contacts <br /> around the world
                </h1>
                <p className="text-gray-500 mb-10 max-w-lg mx-auto">
                    meet real people with this is just a description to describe what's going on here
                </p>
                <div className="text-sm md:text-lg flex items-center md:gap-4 bg-white dark:bg-black/80 dark:border-blue-500 dark:border-2 shadow-lg rounded-full md:px-6 md:py-2 mb-16">
                    <Dropdown text={"I am"} items={["Male", "Female", "Neutral"]} value={gender} onChange={setGender} />
                    <Dropdown text={"looking for"} items={["Male", "Female", "Neutral"]} value={interest} onChange={setInterests} />
                    <button
                        disabled={isButtonDisabled}
                        type="button"
                        onClick={handleContinue}
                        className={`relative flex h-[50px] md:w-40 w-20 items-center justify-center overflow-hidden rounded-full transition-colors ${isButtonDisabled
                            ? "bg-gray-200 dark:bg-blue-500/10 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#917DFF] to-[#5F59FF] text-white before:absolute before:h-0 before:w-0 before:rounded-full before:bg-emerald-300/30 before:transition-all before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56"
                            }`}
                    >
                        <span className="relative z-10">continue</span>
                    </button>
                </div>
                <div className='grid md:grid-cols-3 grid-cols-1 gap-8'>
                    <CardDropshadow title="Connect with People" description="Meet new friends and expand your social circle." img={ico_1} />
                    <CardDropshadow title="Share Interests" description="Find people who share your hobbies and passions." img={ico_1} />
                    <CardDropshadow title="Build Relationships" description="Create meaningful connections with like-minded individuals." img={ico_1} />
                </div>
            </div>
        </section>
    );
}

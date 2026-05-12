import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    useEffect(() => {
        const root = document.documentElement; 

        if (isDarkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);
    return (
        <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative flex items-center justify-between w-[72px] h-10 p-1 border border-gray-300 dark:border-none bg-white dark:bg-[#1A1D24] rounded-full cursor-pointer focus:outline-none"
            aria-label="Toggle Dark Mode"
        >
            <div
                className={`absolute left-1 top-1 w-8 h-8 bg-[#333A4A] rounded-full transition-transform duration-300 ease-in-out ${isDarkMode ? "translate-x-8" : "translate-x-0"}`}
            ></div>
            <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 transition-colors duration-300 ${!isDarkMode ? "text-white" : "text-gray-400"}`}
            >
                <Sun size={20} strokeWidth={2} />
            </div>
            <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-400"}`}
            >
                <Moon size={20} strokeWidth={2} />
            </div>
        </button>
    );
}
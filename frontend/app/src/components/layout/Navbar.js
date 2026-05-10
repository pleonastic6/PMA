import { NavLink } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../buttons/ThemeToggle";
import brand from "../../assets/images/brand.svg";
import { Home, User, Settings, CheckCircle, BarChart3, Menu, X, MapPin } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/map", label: "Map", icon: MapPin },
        { path: "/insights", label: "Insights", icon: BarChart3 },
        { path: "/profile", label: "Profile", icon: User },
        { path: "/settings", label: "Settings", icon: Settings },
        { path: "/tasks", label: "Tasks", icon: CheckCircle },
    ];

    const navLinkClasses = ({ isActive }) => {
        return `relative group pb-1 ${isActive ? "text-indigo-600" : "text-gray-500"
            }`;
    };
    return (
        <>
            <nav className="bg-white top dark:bg-[#101010] dark:text-white flex items-center justify-between shadow-xl font-sans font-normal sticky top-0 z-50">
                <div className="bg-gradient-to-r from-[#7B7DFF] to-[#434FDA] rounded-r-full p-4">
                    <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-lg">
                        <span>Friends</span>
                        <img src={brand} alt="Brand Logo" className="h-8 w-auto" />
                    </NavLink>
                </div>

                <ul className="hidden md:flex space-x-4">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={navLinkClasses}>
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className="pr-4 hidden md:flex items-center gap-4">
                    <ThemeToggle />
                    <NavLink to="/login" className="border border-gray-300 rounded-md px-4 py-2 text-sm dark:text-white text-gray-600 dark:hover:bg-white/10 hover:bg-gray-100 transition-colors">
                        Login
                    </NavLink>
                    <NavLink to="/signup" className="bg-[#574EFF] rounded-md px-4 py-2 text-sm text-white hover:bg-[#4940F4] transition-colors">
                        Sign up
                    </NavLink>
                </div>
                <button className="md:hidden visible" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>
            <div className={`
                fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 
                transition-all duration-300 ease-in-out
                ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}
            `}>
                <div className="dark:bg-[#1A1C1E] bg-white dark:shadow-none dark:text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `transition-transform active:scale-90 ${isActive ? "text-white" : "text-gray-400"}`}
                        >
                            <item.icon size={20} strokeWidth={2.5} />
                        </NavLink>
                    ))}
                    <hr className="border-l border-gray-500 h-6" />
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="ml-2 dark:bg-white/20 bg-black/30 p-1 rounded-md"
                    >
                        <X
                            size={24}
                            strokeWidth={3}
                            className={`text-white transition-all duration-1000 ${isMenuOpen ? "rotate-180" : "rotate-0"
                                }`}
                        />
                    </button>
                </div>
            </div>
        </>
    )
}
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../buttons/ThemeToggle";
import brand from "../../assets/images/brand.svg";
import { Home, User, Settings, BarChart3, Menu, X, MapPin, Calendar, Heart, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const guestNavItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/events", label: "Events", icon: Calendar },
        { path: "/map", label: "Map", icon: MapPin },
    ];

    const authNavItems = [
        { path: "/swipe", label: "Entdecken", icon: Heart },
        { path: "/matches", label: "Matches", icon: MessageCircle },
        { path: "/events", label: "Events", icon: Calendar },
        { path: "/map", label: "Map", icon: MapPin },
        { path: "/profile", label: "Profile", icon: User },
        { path: "/settings", label: "Settings", icon: Settings },
        { path: "/insights", label: "Insights", icon: BarChart3 },
    ];

    const navItems = isLoggedIn ? authNavItems : guestNavItems;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navLinkClasses = ({ isActive }) => {
        return `relative group pb-1 ${isActive ? "text-indigo-600" : "text-gray-500"
            }`;
    };
    return (
        <>
            <nav className="sticky top-0 z-50 flex items-center justify-between bg-white shadow-xl dark:bg-[#101010] dark:text-white">
                <div className="rounded-r-full bg-gradient-to-r from-[#7B7DFF] to-[#434FDA] px-4 py-3 md:p-4">
                    <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-white">
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
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm dark:text-white text-gray-600 dark:hover:bg-white/10 hover:bg-gray-100 transition-colors"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink to="/login" className="border border-gray-300 rounded-md px-4 py-2 text-sm dark:text-white text-gray-600 dark:hover:bg-white/10 hover:bg-gray-100 transition-colors">
                                Login
                            </NavLink>
                            <NavLink to="/signup" className="bg-[#574EFF] rounded-md px-4 py-2 text-sm text-white hover:bg-[#4940F4] transition-colors">
                                Sign up
                            </NavLink>
                        </>
                    )}
                </div>
                <button className="px-4 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menü öffnen">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>
            <div className={`
                fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 transform
                transition-all duration-300 ease-in-out
                ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}
            `}>
                <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-2xl dark:bg-[#1A1C1E] dark:text-white dark:shadow-none">
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
                    {isLoggedIn && (
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="text-gray-400 transition-transform active:scale-90"
                            aria-label="Logout"
                        >
                            <LogOut size={20} strokeWidth={2.5} />
                        </button>
                    )}
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
import { NavLink } from "react-router-dom";
import ThemeToggle from "../buttons/ThemeToggle";
import brand from "../../assets/images/brand.svg";

export default function Navbar() {
    const navItems = [
        { path: "/", label: "Home" },
        { path: "/profile", label: "Profile" },
        { path: "/match", label: "Match" },
        { path: "/insights", label: "Insights" }
    ];

    const navLinkClasses = ({ isActive }) => {
        return `relative group pb-1 ${isActive ? "text-indigo-600" : "text-gray-500"
            }`;
    };
    return (
        <nav className="flex items-center justify-between shadow-xl  font-sans font-normal sticky z-10">
            <div className="bg-gradient-to-r from-[#7B7DFF] to-[#434FDA] rounded-r-full p-4">
                <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-lg">
                    <span>Friends</span>
                    <img src={brand} alt="Brand Logo" className="h-8 w-auto" />
                </NavLink>
            </div>
            <ul className="flex space-x-4">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <NavLink to={item.path} className={navLinkClasses}>
                            {item.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="pr-4 flex items-center gap-4">
                <ThemeToggle />
                <NavLink to="/login" className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                    Login
                </NavLink>
                <NavLink to="/signup" className="border bg-[#574EFF] rounded-md px-4 py-2 text-sm text-white hover:bg-[#4940F4] transition-colors">
                    Sign up
                </NavLink>
            </div>
        </nav>
    )
}
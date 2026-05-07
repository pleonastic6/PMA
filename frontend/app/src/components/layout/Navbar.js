import { NavLink } from "react-router-dom";
import ThemeToggle from "../buttons/ThemeToggle";

export default function Navbar() {
    const navItems = [
        { path: "/", label: "Home" },
        { path: "/profile", label: "Profile" },
        { path: "/match", label: "Match" },
        { path: "/insights", label: "Insights" }
    ];

    const navLinkClasses = ({ isActive }) => {
        return `relative group pb-1 ${
            isActive ? "text-indigo-600" : "text-gray-500"
        }`;
    };
    return (
        <nav className="flex items-center justify-between shadow-xl  font-sans font-normal sticky">
            <div className="bg-[#DFE1FF] rounded-r-full p-4">
                <NavLink to="/">
                    <span>💜</span>
                    <span>Name</span>
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
                <NavLink to="/login">Login</NavLink>
            </div>
        </nav>
    )
}
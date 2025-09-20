import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage or default to false
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <nav
            className="px-6 py-3 flex items-center justify-between shadow"
            style={{ backgroundColor: "#05445E" }}
        >
            {/* Logo Section */}
            <Link to="/dashboard" className="flex items-center gap-2">
                <span className="font-extrabold text-white text-2xl tracking-wide drop-shadow-lg">TALENTFLOW</span>
                <span className="ml-2 text-xs text-blue-100 font-semibold hidden sm:inline drop-shadow">
                    A MINI HIRING PLATFORM
                </span>
            </Link>

            <ul className="text-white md:flex hidden items-center gap-10">
                <li><Link className="hover:text-white/70 transition" to="/dashboard">Dashboard</Link></li>
                <li><Link className="hover:text-white/70 transition" to="/jobs">Jobs</Link></li>
                <li><Link className="hover:text-white/70 transition" to="/candidates">Candidates</Link></li>
                <li><Link className="hover:text-white/70 transition" to="/assessments">Assessments</Link></li>
            </ul>

            {/* Login Button */}
            <Link
                to="/login"
                className="md:inline hidden px-6 py-2 rounded-full bg-[#189AB4] text-white font-semibold hover:bg-[#146C94] transition"
            >
                Login
            </Link>

            <button
                aria-label="menu-btn"
                type="button"
                className="menu-btn inline-block md:hidden active:scale-90 transition"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="#fff"
                >
                    <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
                </svg>
            </button>

            <div className="mobile-menu absolute top-[70px] left-0 w-full bg-gradient-to-r from-indigo-700 to-violet-500 p-6 hidden md:hidden">
                <ul className="flex flex-col space-y-4 text-white text-lg">
                    <li><Link to="#" className="text-sm">Home</Link></li>
                    <li><Link to="#" className="text-sm">Services</Link></li>
                    <li><Link to="#" className="text-sm">Portfolio</Link></li>
                    <li><Link to="#" className="text-sm">Pricing</Link></li>
                </ul>
                <button
                    type="button"
                    className="bg-white text-gray-700 mt-6 inline md:hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
                >
                    Get started
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

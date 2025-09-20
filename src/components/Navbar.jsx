import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply dark mode
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
      className="px-6 py-3 flex items-center justify-between shadow relative z-50"
      style={{ backgroundColor: "#05445E" }}
    >
      {/* Logo Section */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="font-extrabold text-white text-2xl tracking-wide drop-shadow-lg">
          TALENTFLOW
        </span>
        <span className="ml-2 text-xs text-blue-100 font-semibold hidden sm:inline drop-shadow">
          A MINI HIRING PLATFORM
        </span>
      </Link>

      {/* Desktop Links */}
      <ul className="text-white md:flex hidden items-center gap-10">
        <li>
          <Link className="hover:text-white/70 transition" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="hover:text-white/70 transition" to="/jobs">
            Jobs
          </Link>
        </li>
        <li>
          <Link className="hover:text-white/70 transition" to="/candidates">
            Candidates
          </Link>
        </li>
        <li>
          <Link className="hover:text-white/70 transition" to="/assessments">
            Assessments
          </Link>
        </li>
      </ul>

      {/* Login Button */}
      <Link
        to="/login"
        className="md:inline hidden px-6 py-2 rounded-full bg-[#189AB4] text-white font-semibold hover:bg-[#146C94] transition"
      >
        Login
      </Link>

      {/* Hamburger Button */}
      <button
        aria-label="menu-btn"
        type="button"
        className="menu-btn inline-block md:hidden active:scale-90 transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="#75E6DA"
        >
          <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } mobile-menu fixed top-[70px] left-0 w-full p-6 z-50 md:hidden`}
        style={{ backgroundColor: "#189AB4" }}
      >
        <ul className="flex flex-col space-y-4 text-white text-lg">
          <li>
            <Link
              to="/dashboard"
              className="text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              className="text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Jobs
            </Link>
          </li>
          <li>
            <Link
              to="/candidates"
              className="text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Candidates
            </Link>
          </li>
          <li>
            <Link
              to="/assessments"
              className="text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Assessments
            </Link>
          </li>
        </ul>
        
      </div>
    </nav>
  );
};

export default Navbar;

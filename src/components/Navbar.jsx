import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-gradient-to-r from-indigo-700 to-violet-500 transition-all">

                <Link to="/">
                    <svg
                        width="157"
                        height="40"
                        viewBox="0 0 157 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            //   TalentFlow="M47.904 28.28q-1.54 0-2.744-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.82 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.868 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.456.924-3.276.924"
                            fill="#F5F5F5"
                        />
                        <path

                            d="m8.75 11.3 6.75 3.884 6.75-3.885M8.75 34.58v-7.755L2 22.939m27 0-6.75 3.885v7.754M2.405 15.408 15.5 22.954l13.095-7.546M15.5 38V22.939M29 28.915V16.962a2.98 2.98 0 0 0-1.5-2.585L17 8.4a3.01 3.01 0 0 0-3 0L3.5 14.377A3 3 0 0 0 2 16.962v11.953A2.98 2.98 0 0 0 3.5 31.5L14 37.477a3.01 3.01 0 0 0 3 0L27.5 31.5a3 3 0 0 0 1.5-2.585"
                            stroke="#F5F5F5"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>

                <ul className="text-white md:flex hidden items-center gap-10">
                    <li><Link className="hover:text-white/70 transition" to="/dashboard">Dashboard</Link></li>
                    <li><Link className="hover:text-white/70 transition" to="/jobs">Jobs</Link></li>
                    <li><Link className="hover:text-white/70 transition" to="/candidates">Candidates</Link></li>
                    <li><Link className="hover:text-white/70 transition" to="/assessments">Assessments</Link></li>
                </ul>

                <button
                    type="button"
                    className="bg-white text-gray-700 md:inline hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
                >
                    Log in
                </button>

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
        </>
    );
};

export default Navbar;

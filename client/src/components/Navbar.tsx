import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-700 group"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75"
        }`}
      >
        <SunIcon />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          theme === "dark"
            ? "opacity-0 rotate-90 scale-75"
            : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        active
          ? "text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
          : "text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-shadow">
              D
            </div>
            <span className="text-xl font-bold gradient-text">DevHire</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" active={isActive("/jobs")}>Browse Jobs</NavLink>
            <NavLink to="/devs" active={isActive("/devs")}>Find Devs</NavLink>
            {user ? (
              <>
                {user.role === "client" && (
                  <NavLink to="/post-job" active={isActive("/post-job")}>Post a Job</NavLink>
                )}
                <NavLink to="/dashboard" active={isActive("/dashboard")}>Dashboard</NavLink>
                <NavLink to="/messages" active={isActive("/messages")}>Messages</NavLink>
                <div className="ml-3 flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    Logout
                  </button>
                  <Link to="/dashboard" className="avatar w-8 h-8 text-xs shadow-md hover:shadow-lg transition-shadow">
                    {user.name[0].toUpperCase()}
                  </Link>
                </div>
              </>
            ) : (
              <div className="ml-3 flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary btn-sm shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {user && (
              <Link to="/dashboard" className="avatar w-8 h-8 text-xs">
                {user.name[0].toUpperCase()}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700"
              aria-label="Toggle menu"
            >
              <div className="w-4 h-3.5 relative flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full rounded-full bg-slate-600 dark:bg-slate-300 transition-all duration-300 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-[6px]" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-slate-600 dark:bg-slate-300 transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-slate-600 dark:bg-slate-300 transition-all duration-300 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl animate-fade-in-down">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink to="/jobs" onClick={() => setMobileOpen(false)}>Browse Jobs</MobileNavLink>
            <MobileNavLink to="/devs" onClick={() => setMobileOpen(false)}>Find Devs</MobileNavLink>
            {user ? (
              <>
                {user.role === "client" && (
                  <MobileNavLink to="/post-job" onClick={() => setMobileOpen(false)}>Post a Job</MobileNavLink>
                )}
                <MobileNavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/messages" onClick={() => setMobileOpen(false)}>Messages</MobileNavLink>
                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setMobileOpen(false)}>Login</MobileNavLink>
                <div className="pt-2">
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

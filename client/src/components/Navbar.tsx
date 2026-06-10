import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="dh-theme-btn"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className={`dh-theme-icon ${theme === "dark" ? "active" : "inactive"}`}>
        <SunIcon />
      </span>
      <span className={`dh-theme-icon ${theme === "dark" ? "inactive" : "active"}`}
        style={{ transform: theme === "dark" ? "rotate(90deg) scale(0.75)" : "rotate(0deg) scale(1)" }}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} className={`dh-nav-link ${active ? "active" : ""}`}>
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick} className="dh-mobile-link">
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
    <nav className="dh-nav">
      <div className="dh-nav-inner">
        {/* Brand */}
        <Link to={user ? "/dashboard" : "/"} className="dh-nav-brand">
          <span className="dh-nav-brand-mark">DH</span>
          <span className="dh-nav-brand-text">DevHire</span>
        </Link>

        {/* Desktop Nav */}
        <div className="dh-nav-desktop">
          <div className="dh-nav-links">
            <NavLink to="/jobs" active={isActive("/jobs")}>Browse Jobs</NavLink>
            <NavLink to="/devs" active={isActive("/devs")}>Find Devs</NavLink>
            {user ? (
              <>
                {user.role === "client" && (
                  <NavLink to="/post-job" active={isActive("/post-job")}>Post a Job</NavLink>
                )}
                <NavLink to="/dashboard" active={isActive("/dashboard")}>Dashboard</NavLink>
                <NavLink to="/messages" active={isActive("/messages")}>Messages</NavLink>
                <NavLink to="/profile" active={isActive("/profile")}>Profile</NavLink>
              </>
            ) : null}
          </div>

          <div className="dh-nav-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {user ? (
              <div className="dh-avatar-wrapper">
                <button className="dh-avatar">
                  {user.name[0].toUpperCase()}
                </button>
                <div className="dh-dropdown">
                  <div className="dh-dropdown-header">
                    <p className="dh-dropdown-name">{user.name}</p>
                    <p className="dh-dropdown-email">{user.email}</p>
                  </div>
                  <Link to="/profile" className="dh-dropdown-item">Profile</Link>
                  <Link to="/dashboard" className="dh-dropdown-item">Dashboard</Link>
                  <button onClick={handleLogout} className="dh-dropdown-item danger">Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="dh-btn-ghost">Login</Link>
                <Link to="/register" className="dh-btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="dh-nav-mobile-controls">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          {user && (
            <Link to="/profile" className="dh-avatar">
              {user.name[0].toUpperCase()}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`dh-mobile-toggle ${mobileOpen ? "open" : ""}`}
            aria-label="Toggle menu"
          >
            <div className="dh-mobile-toggle-bars">
              <span className="dh-mobile-toggle-bar" />
              <span className="dh-mobile-toggle-bar" />
              <span className="dh-mobile-toggle-bar" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="dh-mobile-menu open">
          <div className="dh-mobile-menu-inner">
            <MobileNavLink to="/jobs" onClick={() => setMobileOpen(false)}>Browse Jobs</MobileNavLink>
            <MobileNavLink to="/devs" onClick={() => setMobileOpen(false)}>Find Devs</MobileNavLink>
            {user ? (
              <>
                {user.role === "client" && (
                  <MobileNavLink to="/post-job" onClick={() => setMobileOpen(false)}>Post a Job</MobileNavLink>
                )}
                <MobileNavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/messages" onClick={() => setMobileOpen(false)}>Messages</MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setMobileOpen(false)}>Profile</MobileNavLink>
                <div className="dh-mobile-divider" />
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="dh-mobile-btn danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setMobileOpen(false)}>Login</MobileNavLink>
                <div>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="dh-mobile-btn"
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

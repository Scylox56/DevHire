import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "Users", end: false },
  { to: "/admin/jobs", label: "Jobs", end: false },
  { to: "/admin/transactions", label: "Transactions", end: false },
  { to: "/admin/reports", label: "Reports", end: false },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="dh-root" style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span className="dh-eyebrow" style={{ margin: 0, fontSize: "0.6rem" }}>Admin Panel</span>
            {isSuperAdmin && (
              <span className="dh-badge" style={{ fontSize: "0.55rem", padding: "2px 8px" }}>
                SUPER
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
            {user?.name}
          </p>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const active = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 6,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: active ? "var(--cyan)" : "var(--text-muted)",
                  background: active ? "var(--badge-bg)" : "transparent",
                  border: active ? "1px solid var(--badge-border)" : "1px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <NavLink
            to="/jobs"
            style={{
              fontSize: "0.75rem",
              color: "var(--text-dim)",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            ← Back to App
          </NavLink>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "32px", overflow: "auto", maxWidth: "calc(100vw - 240px)" }}>
        <Outlet />
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
}

const ROLE_OPTIONS = ["client", "dev", "moderator", "super_admin"];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    params.set("page", String(page));

    api.get(`/admin/users?${params}`).then(({ data }) => {
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSuspend = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/suspend`);
      toast.success("User status updated");
      fetchUsers();
    } catch {}
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      toast.success(`Role changed to ${newRole.replace('_', ' ')}`);
      setEditingRole(null);
      fetchUsers();
    } catch {}
  };

  const isSuperAdmin = currentUser?.role === "super_admin";

  return (
    <div>
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-header-title">Users</h1>
          <p className="dh-page-header-sub">{total} total users</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flex: 1, maxWidth: 400 }}>
          <input
            className="dh-input"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="dh-btn-primary dh-btn-sm">Search</button>
        </form>

        <select className="dh-select" style={{ width: 140 }} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="all">All Roles</option>
          <option value="client">Client</option>
          <option value="dev">Developer</option>
          <option value="moderator">Moderator</option>
          <option value="super_admin">Super Admin</option>
        </select>

        <select className="dh-select" style={{ width: 140 }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="dh-spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : users.length === 0 ? (
        <div className="dh-empty">
          <p className="dh-empty-text">No users found</p>
        </div>
      ) : (
        <>
          <div className="dh-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Joined</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={tdStyle}>
                      <Link to={`/admin/users/${u._id}`} style={{ color: "var(--cyan)", textDecoration: "none", fontWeight: 600 }}>
                        {u.name}
                      </Link>
                    </td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      {editingRole === u._id ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <select
                            className="dh-select"
                            style={{ width: 130, padding: "4px 8px", fontSize: "0.7rem" }}
                            defaultValue={u.role}
                            onChange={(e) => {
                              handleRoleChange(u._id, e.target.value);
                            }}
                            autoFocus
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r === "super_admin" ? "Super Admin" : r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingRole(null)}
                            style={{
                              background: "none", border: "none", color: "var(--text-dim)",
                              cursor: "pointer", fontSize: "0.8rem", padding: "0 4px",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span className={`dh-badge-${u.role === 'super_admin' ? 'in_progress' : u.role === 'moderator' ? 'held' : u.role === 'dev' ? 'open' : 'completed'}`} style={{ fontSize: "0.6rem" }}>
                            {u.role === 'super_admin' ? 'SUPER' : u.role.replace('_', ' ').toUpperCase()}
                          </span>
                          {isSuperAdmin && (
                            <button
                              onClick={() => setEditingRole(u._id)}
                              title="Change role"
                              style={{
                                background: "none", border: "none", color: "var(--text-dim)",
                                cursor: "pointer", fontSize: "0.7rem", padding: 0,
                                textDecoration: "underline", fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {u.isActive ? (
                        <span className="dh-badge-open">ACTIVE</span>
                      ) : (
                        <span className="dh-badge-cancelled">SUSPENDED</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: "var(--text-dim)", fontSize: "0.78rem" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link to={`/admin/users/${u._id}`} className="dh-btn-ghost" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                          View
                        </Link>
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleSuspend(u._id)}
                            className={u.isActive ? "dh-btn-danger" : "dh-btn-success"}
                            style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          >
                            {u.isActive ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="dh-btn-ghost dh-btn-sm">Prev</button>
              <span style={{ display: "flex", alignItems: "center", padding: "0 12px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Page {page} of {pages}
              </span>
              <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="dh-btn-ghost dh-btn-sm">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.65rem",
  letterSpacing: "0.06em",
  color: "var(--text-dim)",
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  color: "var(--text-primary)",
};

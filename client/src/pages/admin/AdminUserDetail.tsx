import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  title?: string;
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  suspendedAt?: string;
  createdAt: string;
  stats: {
    jobsPosted: number;
    jobsCompleted: number;
    totalEarned: number;
    totalSpent: number;
  };
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    api.get(`/admin/users/${id}`).then(({ data }) => setUser(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUser(); }, [id]);

  const handleSuspend = async () => {
    try {
      const { data } = await api.put(`/admin/users/${id}/suspend`);
      setUser((prev) => prev ? { ...prev, isActive: data.isActive, suspendedAt: data.suspendedAt } : prev);
      toast.success(data.isActive ? "User activated" : "User suspended");
    } catch {}
  };

  const handleResetPassword = async () => {
    try {
      const { data } = await api.post(`/admin/users/${id}/reset-password`);
      toast.success(`Temp password: ${data.tempPassword}`, { duration: 10000 });
    } catch {}
  };

  const handleToggleVerify = async () => {
    try {
      const { data } = await api.put(`/admin/users/${id}/verify-dev`);
      setUser((prev) => prev ? { ...prev, isVerified: data.isVerified } : prev);
      toast.success(data.isVerified ? "Dev verified" : "Verification removed");
    } catch {}
  };

  const handleVerifyEmail = async () => {
    try {
      const { data } = await api.put(`/admin/users/${id}/verify-email`);
      setUser((prev) => prev ? { ...prev, emailVerified: data.emailVerified } : prev);
      toast.success("Email verified");
    } catch {}
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      const { data } = await api.put(`/admin/users/${id}`, { role: newRole });
      setUser((prev) => prev ? { ...prev, role: data.role } : prev);
      toast.success(`Role changed to ${newRole}`);
    } catch {}
  };

  const isSuperAdmin = currentUser?.role === "super_admin";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div className="dh-spinner" style={{ margin: "0 auto 16px" }}></div>
        <p style={{ color: "var(--text-muted)" }}>Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return <div className="dh-empty"><p className="dh-empty-text">User not found</p><Link to="/admin/users" className="dh-link">Back to users</Link></div>;
  }

  return (
    <div>
      <Link to="/admin/users" className="dh-link" style={{ marginBottom: 24, display: "inline-block" }}>← Back to Users</Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="dh-card">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="dh-avatar dh-avatar-lg">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="dh-avatar-img" />
              ) : (
                user.name[0].toUpperCase()
              )}
            </div>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)", margin: "0 0 4px" }}>
                {user.name}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>{user.email}</p>
              {user.title && <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", margin: "4px 0 0" }}>{user.title}</p>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <span className={`dh-badge-${user.role === 'super_admin' ? 'in_progress' : user.role === 'moderator' ? 'held' : user.role === 'dev' ? 'open' : 'completed'}`}>
              {user.role === 'super_admin' ? 'SUPER ADMIN' : user.role.replace('_', ' ').toUpperCase()}
            </span>
            {user.isActive ? (
              <span className="dh-badge-open">ACTIVE</span>
            ) : (
              <span className="dh-badge-cancelled">SUSPENDED</span>
            )}
            {user.isVerified && (
              <span className="dh-badge-success">VERIFIED DEV</span>
            )}
            {user.emailVerified ? (
              <span className="dh-badge-success">EMAIL VERIFIED</span>
            ) : (
              <span className="dh-badge-pending">EMAIL UNVERIFIED</span>
            )}
          </div>

          {user.bio && (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>{user.bio}</p>
          )}

          {user.skills.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {user.skills.map((skill) => (
                <span key={skill} className="dh-pill">{skill}</span>
              ))}
            </div>
          )}

          <div className="dh-divider" />

          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
            <p style={{ margin: "0 0 4px" }}>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p style={{ margin: 0 }}>Rating: {user.rating?.toFixed(1) || "N/A"} ({user.reviewCount} reviews)</p>
          </div>
        </div>

        <div>
          <div className="dh-card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", margin: "0 0 16px" }}>
              User Stats
            </h3>
            <div className="dh-grid-2">
              <div className="dh-stat" style={{ padding: 16 }}>
                <div className="dh-stat-value" style={{ fontSize: "1.3rem" }}>{user.stats.jobsPosted}</div>
                <div className="dh-stat-label">Jobs Posted</div>
              </div>
              <div className="dh-stat" style={{ padding: 16 }}>
                <div className="dh-stat-value" style={{ fontSize: "1.3rem", color: "var(--violet)" }}>{user.stats.jobsCompleted}</div>
                <div className="dh-stat-label">Jobs Completed</div>
              </div>
              <div className="dh-stat" style={{ padding: 16 }}>
                <div className="dh-stat-value text-cyan" style={{ fontSize: "1.3rem" }}>
                  ${user.stats.totalEarned.toLocaleString()}
                </div>
                <div className="dh-stat-label">Total Earned</div>
              </div>
              <div className="dh-stat" style={{ padding: 16 }}>
                <div className="dh-stat-value text-cyan" style={{ fontSize: "1.3rem" }}>
                  ${user.stats.totalSpent.toLocaleString()}
                </div>
                <div className="dh-stat-label">Total Spent</div>
              </div>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="dh-card">
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", margin: "0 0 16px" }}>
                Super Admin Actions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <label className="dh-label" style={{ margin: 0, whiteSpace: "nowrap", width: 100 }}>Change Role</label>
                  <select
                    className="dh-select"
                    style={{ flex: 1 }}
                    value={user.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    <option value="client">Client</option>
                    <option value="dev">Developer</option>
                    <option value="moderator">Moderator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={handleSuspend} className={user.isActive ? "dh-btn-danger" : "dh-btn-success"} style={{ fontSize: "0.8rem" }}>
                    {user.isActive ? "Suspend Account" : "Activate Account"}
                  </button>
                  <button onClick={handleResetPassword} className="dh-btn-ghost" style={{ fontSize: "0.8rem" }}>
                    Reset Password
                  </button>
                  {user.role === "dev" && (
                    <button onClick={handleToggleVerify} className={user.isVerified ? "dh-btn-ghost" : "dh-btn-primary"} style={{ fontSize: "0.8rem" }}>
                      {user.isVerified ? "Remove Verification" : "Verify as Developer"}
                    </button>
                  )}
                  {!user.emailVerified && (
                    <button onClick={handleVerifyEmail} className="dh-btn-ghost" style={{ fontSize: "0.8rem" }}>
                      Verify Email
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isSuperAdmin && (
            <div className="dh-chip">
              Some actions require Super Admin privileges
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

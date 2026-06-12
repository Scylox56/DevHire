import { useEffect, useState } from "react";
import api from "../../utils/api";

interface AdminAnalytics {
  totalClients: number;
  totalDevs: number;
  totalModerators: number;
  totalAdmins: number;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  openJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  newSignups: number;
  newJobs: number;
  pendingReports: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    api.get("/analytics/admin").then(({ data }) => setData(data)).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <div style={{ textAlign: "center" }}>
          <div className="dh-spinner" style={{ margin: "0 auto 16px" }}></div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-header-title">Platform Overview</h1>
          <p className="dh-page-header-sub">Key metrics and health of the platform</p>
        </div>
      </div>

      <div className="dh-grid-2" style={{ marginBottom: 40 }}>
        <div className="dh-stat" style={{ textAlign: "left" }}>
          <div className="dh-stat-label">Total Users</div>
          <div className="dh-stat-value" style={{ fontSize: "2rem", marginBottom: 12 }}>
            {(data.totalClients + data.totalDevs + data.totalModerators + data.totalAdmins).toLocaleString()}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <span>Clients: <strong style={{ color: "var(--text-primary)" }}>{data.totalClients}</strong></span>
            <span>Devs: <strong style={{ color: "var(--text-primary)" }}>{data.totalDevs}</strong></span>
            <span>Staff: <strong style={{ color: "var(--text-primary)" }}>{data.totalModerators + data.totalAdmins}</strong></span>
          </div>
        </div>

        <div className="dh-stat" style={{ textAlign: "left" }}>
          <div className="dh-stat-label">New Signups (30d)</div>
          <div className="dh-stat-value" style={{ fontSize: "2rem", color: "var(--violet)", marginBottom: 12 }}>
            {data.newSignups}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            New jobs posted: <strong style={{ color: "var(--text-primary)" }}>{data.newJobs}</strong>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 20, letterSpacing: "-0.01em" }}>
        Jobs
      </h2>
      <div className="dh-grid-responsive" style={{ marginBottom: 40 }}>
        <div className="dh-stat">
          <div className="dh-stat-value">{data.totalJobs}</div>
          <div className="dh-stat-label">Total Jobs</div>
        </div>
        <div className="dh-stat">
          <div className="dh-stat-value" style={{ color: "var(--cyan)" }}>{data.openJobs}</div>
          <div className="dh-stat-label">Open</div>
        </div>
        <div className="dh-stat">
          <div className="dh-stat-value" style={{ color: "var(--violet)" }}>{data.activeJobs}</div>
          <div className="dh-stat-label">In Progress</div>
        </div>
        <div className="dh-stat">
          <div className="dh-stat-value" style={{ color: "var(--cyan)" }}>{data.completedJobs}</div>
          <div className="dh-stat-label">Completed</div>
        </div>
        <div className="dh-stat">
          <div className="dh-stat-value" style={{ color: "var(--crimson)" }}>{data.cancelledJobs}</div>
          <div className="dh-stat-label">Cancelled</div>
        </div>
        <div className="dh-stat">
          <div className="dh-stat-value text-cyan">
            ${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="dh-stat-label">Total Revenue</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div className="dh-stat" style={{ flex: 1, textAlign: "left" }}>
          <div className="dh-stat-label">Pending Reports</div>
          <div className="dh-stat-value" style={{ fontSize: "1.8rem", color: "var(--crimson)" }}>
            {data.pendingReports}
          </div>
        </div>
      </div>
    </div>
  );
}

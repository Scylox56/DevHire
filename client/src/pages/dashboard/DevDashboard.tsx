import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

interface Analytics {
  totalProposals: number;
  acceptedProposals: number;
  totalEarned: number;
  activeJobs: number;
  completedJobs: number;
  recentJobs: any[];
}

export default function DevDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    api.get("/analytics/dev").then(({ data }) => setData(data)).catch(() => setData({
      totalProposals: 0, acceptedProposals: 0, totalEarned: 0, activeJobs: 0, completedJobs: 0, recentJobs: [],
    }));
  }, []);

  if (!data) {
    return (
      <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="dh-spinner" style={{ margin: "0 auto 16px" }}></div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dh-root" style={{ padding: "48px 0" }}>
      <div className="dh-container">
        <div className="dh-page-header">
          <div>
            <h1 className="dh-page-header-title">Developer Dashboard</h1>
            <p className="dh-page-header-sub">Track your projects and earnings</p>
          </div>
          <Link to="/jobs" className="dh-btn-primary">Browse Jobs</Link>
        </div>

        <div className="dh-grid-responsive" style={{ marginBottom: 48 }}>
          <div className="dh-stat">
            <div className="dh-stat-value">{data.totalProposals}</div>
            <div className="dh-stat-label">Proposals Sent</div>
          </div>
          <div className="dh-stat">
            <div className="dh-stat-value" style={{ color: "var(--cyan)" }}>{data.acceptedProposals}</div>
            <div className="dh-stat-label">Accepted</div>
          </div>
          <div className="dh-stat">
            <div className="dh-stat-value" style={{ color: "var(--violet)" }}>{data.activeJobs}</div>
            <div className="dh-stat-label">Active Jobs</div>
          </div>
          <div className="dh-stat">
            <div className="dh-stat-value" style={{ color: "var(--cyan)" }}>{data.completedJobs}</div>
            <div className="dh-stat-label">Completed</div>
          </div>
          <div className="dh-stat">
            <div className="dh-stat-value">{data.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <div className="dh-stat-label">Total Earned</div>
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: 24 }}>Recent Jobs</h2>
          {data.recentJobs.length === 0 ? (
            <div className="dh-empty">
              <p className="dh-empty-text">No active jobs yet</p>
              <Link to="/jobs" className="dh-btn-ghost">Start Browsing Jobs</Link>
            </div>
          ) : (
            <div className="dh-grid-responsive">
              {data.recentJobs.map((job: any) => (
                <Link
                  to={`/jobs/${job._id}`}
                  key={job._id}
                  className="dh-card dh-card-hover"
                  style={{ display: "block", textDecoration: "none" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span className="dh-badge" data-status={job.status}>
                      {job.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em", color: "var(--text-primary)", margin: "0 0 12px", transition: "color 0.2s" }}>
                    {job.title}
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <span className="text-cyan" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      ${job.budget.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    {job.client && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{job.client.name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  client: { _id: string; name: string };
  awardedTo?: { _id: string; name: string };
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    params.set("page", String(page));

    api.get(`/admin/jobs?${params}`).then(({ data }) => {
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleCancel = async (jobId: string) => {
    try {
      await api.put(`/admin/jobs/${jobId}/status`, { status: "cancelled" });
      fetchJobs();
    } catch {}
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "open": return "dh-badge-open";
      case "in_progress": return "dh-badge-in_progress";
      case "completed": return "dh-badge-completed";
      case "cancelled": return "dh-badge-cancelled";
      default: return "dh-badge-pending";
    }
  };

  return (
    <div>
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-header-title">Jobs</h1>
          <p className="dh-page-header-sub">{total} total jobs</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flex: 1, maxWidth: 400 }}>
          <input
            className="dh-input"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="dh-btn-primary dh-btn-sm">Search</button>
        </form>

        <select className="dh-select" style={{ width: 160 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="dh-spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="dh-empty"><p className="dh-empty-text">No jobs found</p></div>
      ) : (
        <>
          <div className="dh-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Client</th>
                  <th style={thStyle}>Budget</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Awarded To</th>
                  <th style={thStyle}>Posted</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={tdStyle}>
                      <Link to={`/admin/jobs/${job._id}`} style={{ color: "var(--cyan)", textDecoration: "none", fontWeight: 600 }}>
                        {job.title}
                      </Link>
                    </td>
                    <td style={tdStyle}>{job.client?.name || "Unknown"}</td>
                    <td style={tdStyle}><span className="text-cyan" style={{ fontWeight: 600 }}>${job.budget?.toLocaleString()}</span></td>
                    <td style={tdStyle}>
                      <span className={statusColor(job.status)} style={{ fontSize: "0.6rem" }}>
                        {job.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: "var(--text-dim)" }}>{job.awardedTo?.name || "—"}</td>
                    <td style={{ ...tdStyle, color: "var(--text-dim)", fontSize: "0.78rem" }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link to={`/admin/jobs/${job._id}`} className="dh-btn-ghost" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                          View
                        </Link>
                        {job.status !== "cancelled" && job.status !== "completed" && (
                          <button onClick={() => handleCancel(job._id)} className="dh-btn-danger" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                            Cancel
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

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";

interface ReportTarget {
  _id?: string;
  title?: string;
  name?: string;
  client?: { _id: string; name: string };
}

interface Report {
  _id: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  reportedBy: { _id: string; name: string; avatar?: string };
  resolvedBy?: { _id: string; name: string };
  createdAt: string;
  target: ReportTarget | null;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    params.set("page", String(page));

    api.get(`/admin/reports?${params}`).then(({ data }) => {
      setReports(data.reports);
      setTotal(data.total);
      setPages(data.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, [page, status]);

  const handleResolve = async (reportId: string, newStatus: string) => {
    try {
      await api.put(`/admin/reports/${reportId}`, { status: newStatus });
      toast.success(`Report ${newStatus}`);
      fetchReports();
    } catch {}
  };

  const handleRemove = async (type: string, id: string, reportId: string) => {
    try {
      await api.delete(`/admin/content/${type}/${id}`);
      await api.put(`/admin/reports/${reportId}`, { status: "resolved" });
      toast.success(`${type} removed`);
      fetchReports();
    } catch {}
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case "pending": return "dh-badge-pending";
      case "resolved": return "dh-badge-completed";
      case "dismissed": return "dh-badge-cancelled";
      default: return "dh-badge-pending";
    }
  };

  return (
    <div>
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-header-title">Reports</h1>
          <p className="dh-page-header-sub">{total} total reports</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select className="dh-select" style={{ width: 160 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="dh-spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="dh-empty"><p className="dh-empty-text">No reports found</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reports.map((report) => (
            <div key={report._id} className="dh-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span className={statusBadge(report.status)} style={{ fontSize: "0.55rem" }}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className="dh-pill" style={{ fontSize: "0.55rem", padding: "2px 8px" }}>
                      {report.targetType.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", margin: "0 0 4px" }}>
                    {report.reason}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", margin: 0 }}>
                    Reported by {report.reportedBy?.name || "Unknown"} on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  {report.target && (
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                      Target: {report.target.title || report.target.name || report.targetId}
                      {report.target.client && ` (by ${report.target.client.name})`}
                    </p>
                  )}
                </div>
              </div>

              {report.status === "pending" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleResolve(report._id, "resolved")} className="dh-btn-success" style={{ fontSize: "0.75rem", padding: "6px 14px" }}>
                    Resolve
                  </button>
                  <button onClick={() => handleResolve(report._id, "dismissed")} className="dh-btn-ghost" style={{ fontSize: "0.75rem", padding: "6px 14px" }}>
                    Dismiss
                  </button>
                  {(report.targetType === "job" || report.targetType === "message") && (
                    <button
                      onClick={() => handleRemove(report.targetType, report.targetId, report._id)}
                      className="dh-btn-danger"
                      style={{ fontSize: "0.75rem", padding: "6px 14px" }}
                    >
                      Remove Content
                    </button>
                  )}
                </div>
              )}

              {report.resolvedBy && (
                <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", margin: "8px 0 0" }}>
                  Resolved by {report.resolvedBy.name}
                </p>
              )}
            </div>
          ))}

          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="dh-btn-ghost dh-btn-sm">Prev</button>
              <span style={{ display: "flex", alignItems: "center", padding: "0 12px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Page {page} of {pages}
              </span>
              <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="dh-btn-ghost dh-btn-sm">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

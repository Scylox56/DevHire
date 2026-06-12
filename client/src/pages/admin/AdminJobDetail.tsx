import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";

interface Proposal {
  _id: string;
  dev: { _id: string; name: string; avatar?: string; title?: string; hourlyRate?: number };
  coverLetter: string;
  bidAmount: number;
  status: string;
}

interface JobDetail {
  _id: string;
  title: string;
  description: string;
  budget: number;
  timeline: number;
  techStack: string[];
  status: string;
  createdAt: string;
  client: { _id: string; name: string; email: string };
  awardedTo?: { _id: string; name: string; email: string };
  proposals: Proposal[];
}

export default function AdminJobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = () => {
    api.get(`/admin/jobs/${id}`).then(({ data }) => setJob(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJob(); }, [id]);

  const handleStatusChange = async (status: string) => {
    try {
      await api.put(`/admin/jobs/${id}/status`, { status });
      toast.success(`Job status changed to ${status}`);
      fetchJob();
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div className="dh-spinner" style={{ margin: "0 auto 16px" }}></div>
      </div>
    );
  }

  if (!job) {
    return <div className="dh-empty"><p className="dh-empty-text">Job not found</p><Link to="/admin/jobs" className="dh-link">Back to jobs</Link></div>;
  }

  return (
    <div>
      <Link to="/admin/jobs" className="dh-link" style={{ marginBottom: 24, display: "inline-block" }}>← Back to Jobs</Link>

      <div className="dh-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--text-primary)", margin: "0 0 8px" }}>
              {job.title}
            </h1>
            <span className={statusColor(job.status)}>{job.status.replace("_", " ").toUpperCase()}</span>
          </div>
          <div className="text-cyan" style={{ fontWeight: 700, fontSize: "1.3rem" }}>
            ${job.budget.toLocaleString()}
          </div>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>{job.description}</p>

        <div style={{ display: "flex", gap: 24, fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: 16 }}>
          <span>Timeline: <strong style={{ color: "var(--text-primary)" }}>{job.timeline} days</strong></span>
          <span>Posted: <strong style={{ color: "var(--text-primary)" }}>{new Date(job.createdAt).toLocaleDateString()}</strong></span>
          <span>Client: <strong style={{ color: "var(--cyan)" }}>{job.client?.name || "Unknown"}</strong></span>
          {job.awardedTo && <span>Awarded to: <strong style={{ color: "var(--violet)" }}>{job.awardedTo.name}</strong></span>}
        </div>

        {job.techStack?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {job.techStack.map((t) => <span key={t} className="dh-pill">{t}</span>)}
          </div>
        )}

        <div className="dh-divider" />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {job.status !== "completed" && job.status !== "cancelled" && (
            <button onClick={() => handleStatusChange("cancelled")} className="dh-btn-danger" style={{ fontSize: "0.8rem" }}>
              Cancel Job
            </button>
          )}
          {job.status === "cancelled" && (
            <button onClick={() => handleStatusChange("open")} className="dh-btn-primary" style={{ fontSize: "0.8rem" }}>
              Re-open Job
            </button>
          )}
          {job.status === "in_progress" && (
            <button onClick={() => handleStatusChange("completed")} className="dh-btn-success" style={{ fontSize: "0.8rem" }}>
              Force Complete
            </button>
          )}
        </div>
      </div>

      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 16 }}>
        Proposals ({job.proposals?.length || 0})
      </h2>

      {(!job.proposals || job.proposals.length === 0) ? (
        <div className="dh-empty"><p className="dh-empty-text">No proposals yet</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {job.proposals.map((proposal) => (
            <div key={proposal._id} className="dh-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="dh-avatar dh-avatar-sm">
                    {proposal.dev?.avatar ? (
                      <img src={proposal.dev.avatar} alt={proposal.dev.name} className="dh-avatar-img" />
                    ) : (
                      proposal.dev?.name?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", margin: 0 }}>
                      {proposal.dev?.name || "Unknown"}
                    </p>
                    {proposal.dev?.title && (
                      <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", margin: 0 }}>{proposal.dev.title}</p>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="text-cyan" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    ${proposal.bidAmount?.toLocaleString()}
                  </div>
                  <span className={`dh-badge-${proposal.status === 'accepted' ? 'in_progress' : proposal.status === 'rejected' ? 'cancelled' : 'open'}`} style={{ fontSize: "0.55rem" }}>
                    {proposal.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{proposal.coverLetter}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

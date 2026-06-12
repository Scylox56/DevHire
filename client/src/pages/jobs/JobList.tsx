import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

interface Job {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  budget: number;
  timeline: number;
  status: string;
  client: { _id: string; name: string; avatar?: string };
  createdAt: string;
}

export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs?status=open")
      .then(({ data }) => {
        setJobs(data.jobs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="dh-root"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="dh-spinner" style={{ margin: "0 auto 16px" }}></div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Loading amazing opportunities...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dh-root" style={{ padding: "48px 0" }}>
      <div className="dh-container">
        <div className="dh-page-header">
          <div>
            <h1 className="dh-page-header-title">Browse Jobs</h1>
            <p className="dh-page-header-sub">Find your next amazing project</p>
          </div>
          {user?.role === "client" && (
            <Link to="/post-job" className="dh-btn-primary">
              Post a Job
            </Link>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="dh-empty">
            <h3 className="dh-empty-title">No Open Jobs Available</h3>
            <p className="dh-empty-text">
              Check back soon for new opportunities
            </p>
            <Link to="/devs" className="dh-btn-ghost">
              Explore Developers Instead
            </Link>
          </div>
        ) : (
          <div className="dh-grid-responsive">
            {jobs.map((job) => (
              <Link
                to={`/jobs/${job._id}`}
                key={job._id}
                className="dh-card dh-card-hover"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <span className="dh-badge" data-status={job.status}>
                    {job.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}
                  >
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    letterSpacing: "-0.01em",
                    color: "var(--text-primary)",
                    margin: "0 0 12px",
                    transition: "color 0.2s",
                  }}
                  className="job-title-hover"
                >
                  {job.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginBottom: 16,
                    lineHeight: 1.6,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {job.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 16,
                    flexWrap: "wrap",
                  }}
                >
                  {job.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="dh-pill">
                      {tech}
                    </span>
                  ))}
                  {job.techStack.length > 3 && (
                    <span className="dh-pill">+{job.techStack.length - 3}</span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    paddingTop: 16,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text-dim)",
                        margin: "0 0 4px",
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.08em",
                      }}
                    >
                      BUDGET
                    </p>
                    <p
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: "var(--cyan)",
                        margin: 0,
                      }}
                    >
                      $
                      {job.budget.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text-dim)",
                        margin: "0 0 4px",
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.08em",
                      }}
                    >
                      TIMELINE
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {job.timeline} days
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

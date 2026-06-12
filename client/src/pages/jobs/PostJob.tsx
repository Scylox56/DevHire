import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function PostJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/jobs", {
        title,
        description,
        techStack: techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        budget: Number(budget),
        timeline: Number(timeline),
      });
      toast.success("Job posted successfully!");
      navigate(`/jobs/${data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dh-root" style={{ padding: "48px 0" }}>
      <div className="dh-container" style={{ maxWidth: 640 }}>
        <Link to="/jobs" className="dh-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: "0.8rem" }}>
          ← Back to Jobs
        </Link>

        <div className="dh-card" style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 className="dh-page-header-title" style={{ marginBottom: 8 }}>Post a New Job</h1>
            <p className="dh-page-header-sub">
              Tell developers about your project and find the perfect match
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="dh-form-group">
              <label className="dh-label">Project Title</label>
              <input
                type="text"
                className="dh-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build React E-commerce Dashboard"
                required
              />
            </div>

            <div className="dh-form-group">
              <label className="dh-label">Project Description</label>
              <textarea
                className="dh-textarea"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project, requirements, and expectations..."
                required
              />
            </div>

            <div className="dh-form-group">
              <label className="dh-label">Tech Stack (comma-separated)</label>
              <input
                type="text"
                className="dh-input"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB, TypeScript"
                required
              />
            </div>

            <div className="dh-grid-2" style={{ gap: 24 }}>
              <div className="dh-form-group">
                <label className="dh-label">Budget ($)</label>
                <input
                  type="number"
                  className="dh-input"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min={1}
                  placeholder="2000"
                  required
                />
              </div>
              <div className="dh-form-group">
                <label className="dh-label">Timeline (days)</label>
                <input
                  type="number"
                  className="dh-input"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  min={1}
                  placeholder="30"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="dh-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="dh-spinner dh-spinner-sm"></span>
                  Posting your job...
                </>
              ) : (
                <>Post Job</>
              )}
            </button>
          </form>
        </div>

        <div className="dh-grid-2" style={{ gap: 16 }}>
          <div className="dh-chip" style={{ flexDirection: "column", textAlign: "center", padding: "20px 16px" }}>
            <span className="text-cyan" style={{ fontSize: "1.4rem", marginBottom: 8, fontWeight: 700 }}>✦</span>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", margin: "0 0 4px" }}>Be Specific</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Clear requirements attract qualified developers</p>
          </div>
          <div className="dh-chip" style={{ flexDirection: "column", textAlign: "center", padding: "20px 16px" }}>
            <span className="text-cyan" style={{ fontSize: "1.4rem", marginBottom: 8, fontWeight: 700 }}>★</span>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", margin: "0 0 4px" }}>Set Fair Budget</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Competitive budget gets better proposals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

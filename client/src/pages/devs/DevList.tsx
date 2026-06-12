import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

interface Dev {
  _id: string;
  name: string;
  avatar?: string;
  title?: string;
  skills: string[];
  hourlyRate?: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  bio?: string;
}

export default function DevList() {
  const [devs, setDevs] = useState<Dev[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/devs")
      .then(({ data }) => {
        setDevs(data.devs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="dh-spinner" style={{ margin: "0 auto 16px" }}></div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading talented developers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dh-root" style={{ padding: "48px 0" }}>
      <div className="dh-container">
        <div style={{ marginBottom: 48 }}>
          <h1 className="dh-page-header-title">Find Developers</h1>
          <p className="dh-page-header-sub">Discover talented developers for your projects</p>
        </div>

        {devs.length === 0 ? (
          <div className="dh-empty">
            <h3 className="dh-empty-title">No Developers Available</h3>
            <p className="dh-empty-text">Check back soon for talented developers</p>
          </div>
        ) : (
          <div className="dh-grid-responsive">
            {devs.map((dev) => (
              <Link
                to={`/devs/${dev._id}`}
                key={dev._id}
                className="dh-card dh-card-hover"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div className="dh-avatar" style={{ width: 44, height: 44, fontSize: "0.9rem" }}>
                    {dev.avatar ? (
                      <img src={dev.avatar} alt={dev.name} className="dh-avatar-img" />
                    ) : (
                      dev.name[0]
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em", color: "var(--text-primary)", transition: "color 0.2s" }}>
                      {dev.name}
                    </div>
                    {dev.title && <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{dev.title}</div>}
                  </div>
                </div>

                {dev.bio && (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {dev.bio}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {dev.skills.slice(0, 4).map((s) => (
                    <span key={s} className="dh-pill">{s}</span>
                  ))}
                  {dev.skills.length > 4 && <span className="dh-pill">+{dev.skills.length - 4}</span>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, paddingTop: 16, borderTop: "1px solid var(--border)", textAlign: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--cyan)", margin: 0 }}>
                      ★ {dev.rating.toFixed(1)}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: "2px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
                      {dev.reviewCount} reviews
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--violet)", margin: 0 }}>
                      {dev.completedJobs}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: "2px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
                      Projects
                    </p>
                  </div>
                  <div>
                    <p className="text-cyan" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>
                      {dev.hourlyRate ? `$${dev.hourlyRate}` : "—"}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: "2px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
                      {dev.hourlyRate ? "/hr" : "Rate"}
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

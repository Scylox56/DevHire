import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

interface Dev {
  _id: string; name: string; email: string; avatar?: string;
  title?: string; bio?: string; skills: string[]; hourlyRate?: number;
  portfolio: { title: string; url: string; description?: string }[];
  completedJobs: number; rating: number; reviewCount: number;
  createdAt: string;
}

interface Review {
  _id: string; rating: number; comment: string;
  reviewer: { _id: string; name: string; avatar?: string };
  job: { _id: string; title: string };
  role: string; createdAt: string;
}

export default function DevDetail() {
  const { id } = useParams<{ id: string }>();
  const [dev, setDev] = useState<Dev | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/devs/${id}`),
      api.get(`/reviews/user/${id}`),
    ]).then(([devRes, reviewRes]) => {
      setDev(devRes.data);
      setReviews(reviewRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="dh-spinner"></div>
    </div>
  );
  if (!dev) return (
    <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>Developer not found</p>
    </div>
  );

  return (
    <div className="dh-root" style={{ padding: "48px 0" }}>
      <div className="dh-container">
        <Link to="/devs" className="dh-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", marginBottom: 24 }}>
          &larr; Back to Developers
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
          <div>
            <div className="dh-card" style={{ marginBottom: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div className="dh-avatar" style={{ width: 80, height: 80, fontSize: "1.75rem", margin: "0 auto 16px" }}>
                  {dev.avatar ? (
                    <img src={dev.avatar} alt={dev.name} className="dh-avatar-img" />
                  ) : (
                    dev.name[0]
                  )}
                </div>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.35rem", letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 }}>
                  {dev.name}
                </h1>
                {dev.title && <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: 4 }}>{dev.title}</div>}
              </div>

              <div className="dh-divider" style={{ margin: "16px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "var(--cyan)", lineHeight: 1 }}>{dev.rating.toFixed(1)}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 4 }}>{dev.reviewCount} Reviews</div>
                </div>
                <div className="dh-divider" style={{ margin: 0 }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "var(--violet)", lineHeight: 1 }}>{dev.completedJobs}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 4 }}>Jobs Completed</div>
                </div>
                {dev.hourlyRate && (
                  <>
                    <div className="dh-divider" style={{ margin: 0 }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "var(--text-primary)", lineHeight: 1 }}>${dev.hourlyRate}<span style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>/hr</span></div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 4 }}>Hourly Rate</div>
                    </div>
                  </>
                )}
              </div>

              <div className="dh-divider" style={{ margin: "16px 0" }} />

              {dev.createdAt && (
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1 }}>{new Date(dev.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 4 }}>Member Since</div>
                </div>
              )}

              <h3 className="dh-eyebrow" style={{ marginBottom: 10, textAlign: "center" }}>Skills</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {dev.skills.map((s) => (
                  <span key={s} className="dh-pill">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div>
            {dev.bio && (
              <div className="dh-card" style={{ marginBottom: 24 }}>
                <h3 className="dh-eyebrow" style={{ marginBottom: 12 }}>About</h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>{dev.bio}</p>
              </div>
            )}

            {dev.portfolio.length > 0 && (
              <div className="dh-card" style={{ marginBottom: 24 }}>
                <h3 className="dh-eyebrow" style={{ marginBottom: 16 }}>Portfolio</h3>
                <div className="dh-grid-2">
                  {dev.portfolio.map((p, i) => (
                    <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, transition: "border-color 0.2s" }}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", textDecoration: "none" }}>
                        {p.title}
                      </a>
                      {p.description && <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>{p.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="dh-card">
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "var(--text-primary)", margin: "0 0 20px" }}>
                Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reviews.map((r) => (
                    <div key={r._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div className="dh-avatar" style={{ width: 36, height: 36, fontSize: "0.8rem" }}>
                          {r.reviewer.avatar ? (
                            <img src={r.reviewer.avatar} alt={r.reviewer.name} className="dh-avatar-img" />
                          ) : (
                            r.reviewer.name[0]
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "var(--text-primary)" }}>{r.reviewer.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: 2 }}>on <span style={{ color: "var(--text-muted)" }}>{r.job.title}</span></div>
                        </div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--cyan)" }}>{r.rating}/5</div>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dh-empty" style={{ margin: 0 }}>
                  <p className="dh-empty-text" style={{ marginBottom: 0 }}>No reviews yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

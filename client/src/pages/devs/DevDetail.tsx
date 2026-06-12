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
      <div className="dh-container" style={{ maxWidth: 800 }}>
        <Link to="/devs" className="dh-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
          &larr; Back to Developers
        </Link>

        <div className="dh-card" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div className="dh-avatar dh-avatar-lg">
              {dev.avatar ? (
                <img src={dev.avatar} alt={dev.name} className="dh-avatar-img" />
              ) : (
                dev.name[0]
              )}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 }}>
                {dev.name}
              </h1>
              {dev.title && <div style={{ fontSize: "0.88rem", color: "var(--text-dim)", marginTop: 4 }}>{dev.title}</div>}
              <div style={{ display: "flex", gap: 20, fontSize: "0.82rem", marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ color: "var(--text-muted)" }}>★ {dev.rating.toFixed(1)} ({dev.reviewCount} reviews)</span>
                <span style={{ color: "var(--text-muted)" }}>{dev.completedJobs} jobs completed</span>
                {dev.hourlyRate && <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--cyan)" }}>${dev.hourlyRate}/hr</span>}
              </div>
            </div>
          </div>

          {dev.bio && (
            <>
              <h3 className="dh-eyebrow" style={{ marginBottom: 8 }}>About</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 24 }}>{dev.bio}</p>
            </>
          )}

          <h3 className="dh-eyebrow" style={{ marginBottom: 8 }}>Skills</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {dev.skills.map((s) => (
              <span key={s} className="dh-pill">{s}</span>
            ))}
          </div>

          {dev.portfolio.length > 0 && (
            <>
              <h3 className="dh-eyebrow" style={{ marginBottom: 8 }}>Portfolio</h3>
              <div className="dh-grid-2" style={{ marginBottom: 24 }}>
                {dev.portfolio.map((p, i) => (
                  <div key={i} className="dh-card" style={{ padding: 20 }}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="dh-link" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {p.title}
                    </a>
                    {p.description && <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: 8 }}>{p.description}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="dh-card" style={{ marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "var(--text-primary)", margin: "0 0 16px" }}>
            Reviews ({reviews.length})
          </h2>
          {reviews.map((r) => (
            <div key={r._id} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div className="dh-avatar dh-avatar-sm">
                  {r.reviewer.avatar ? (
                    <img src={r.reviewer.avatar} alt={r.reviewer.name} className="dh-avatar-img" />
                  ) : (
                    r.reviewer.name[0]
                  )}
                </div>
                <div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{r.reviewer.name}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}> on {r.job.title}</span>
                </div>
                <span style={{ fontSize: "0.82rem", marginLeft: "auto", color: "var(--text-muted)" }}>★ {r.rating}/5</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>{r.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p style={{ color: "var(--text-dim)", fontSize: "0.88rem" }}>No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}

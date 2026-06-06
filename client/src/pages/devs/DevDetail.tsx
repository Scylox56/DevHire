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

  if (loading) return <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>Loading...</div>;
  if (!dev) return <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>Developer not found</div>;

  return (
    <div className="container" style={{ marginTop: 32 }}>
      <Link to="/devs" className="text-muted text-sm">&larr; Back to Developers</Link>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="flex items-center gap-4" style={{ marginBottom: 20 }}>
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 22 }}>{dev.name[0]}</div>
          <div>
            <h1>{dev.name}</h1>
            {dev.title && <div className="text-muted">{dev.title}</div>}
            <div className="flex gap-4 text-sm mt-2">
              <span>⭐ {dev.rating.toFixed(1)} ({dev.reviewCount} reviews)</span>
              <span>{dev.completedJobs} jobs completed</span>
              {dev.hourlyRate && <span className="font-bold">${dev.hourlyRate}/hr</span>}
            </div>
          </div>
        </div>

        {dev.bio && (
          <>
            <h3 style={{ marginBottom: 8 }}>About</h3>
            <p style={{ marginBottom: 20 }}>{dev.bio}</p>
          </>
        )}

        <h3 style={{ marginBottom: 8 }}>Skills</h3>
        <div className="flex gap-2" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
          {dev.skills.map((s) => (
            <span key={s} className="badge badge-open">{s}</span>
          ))}
        </div>

        {dev.portfolio.length > 0 && (
          <>
            <h3 style={{ marginBottom: 8 }}>Portfolio</h3>
            <div className="grid grid-2" style={{ marginBottom: 20 }}>
              {dev.portfolio.map((p, i) => (
                <div key={i} className="card">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-bold">{p.title}</a>
                  {p.description && <p className="text-muted text-sm mt-2">{p.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2 style={{ marginBottom: 16 }}>Reviews ({reviews.length})</h2>
        {reviews.map((r) => (
          <div key={r._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <div className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>{r.reviewer.name[0]}</div>
              <div>
                <span className="font-bold text-sm">{r.reviewer.name}</span>
                <span className="text-muted text-sm"> on {r.job.title}</span>
              </div>
              <span className="text-sm" style={{ marginLeft: 'auto' }}>⭐ {r.rating}/5</span>
            </div>
            <p className="text-muted text-sm">{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
      </div>
    </div>
  );
}

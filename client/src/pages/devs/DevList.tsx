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
      <div className="container py-20 text-center">
        <div className="spinner mx-auto mb-4 h-8 w-8"></div>
        <p className="text-slate-600 dark:text-slate-400">
          Loading talented developers...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-12">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            👨‍💻 Find Developers
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Discover talented developers for your projects
          </p>
        </div>

        {devs.length === 0 ? (
          <div className="glass-card-light text-center py-16">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-xl font-semibold mb-2">
              No Developers Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Check back soon for talented developers
            </p>
          </div>
        ) : (
          <div className="grid-responsive">
            {devs.map((dev) => (
              <Link
                to={`/devs/${dev._id}`}
                key={dev._id}
                className="glass-card-light group cursor-pointer overflow-hidden"
              >
                {/* Header with avatar and name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar text-lg">{dev.name[0]}</div>
                  <div className="flex-1">
                    <div className="font-bold text-lg group-hover:gradient-text transition-all">
                      {dev.name}
                    </div>
                    {dev.title && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {dev.title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {dev.bio && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {dev.bio}
                  </p>
                )}

                {/* Skills */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {dev.skills.slice(0, 4).map((s) => (
                    <span key={s} className="badge badge-primary text-xs">
                      {s}
                    </span>
                  ))}
                  {dev.skills.length > 4 && (
                    <span className="badge bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                      +{dev.skills.length - 4}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
                  <div>
                    <p className="font-bold text-primary-500 dark:text-primary-400">
                      ⭐ {dev.rating.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {dev.reviewCount} reviews
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-secondary-500 dark:text-secondary-400">
                      {dev.completedJobs}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Projects
                    </p>
                  </div>
                  <div>
                    <p className="font-bold gradient-text">
                      {dev.hourlyRate ? `$${dev.hourlyRate}` : "—"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
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

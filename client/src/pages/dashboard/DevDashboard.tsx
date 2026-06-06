import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

interface Analytics {
  totalProposals: number;
  acceptedProposals: number;
  totalEarned: number;
  activeJobs: number;
  completedJobs: number;
  recentJobs: any[];
}

export default function DevDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    api.get("/analytics/dev").then(({ data }) => setData(data)).catch(() => setData({
      totalProposals: 0, acceptedProposals: 0, totalEarned: 0, activeJobs: 0, completedJobs: 0, recentJobs: [],
    }));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4 h-8 w-8"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-12">
      <div className="container">
        {/* Header */}
        <div className="page-header mb-12 items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Developer Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your projects and earnings
            </p>
          </div>
          <Link to="/jobs" className="btn btn-primary flex items-center gap-2">
            Browse Jobs
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid-3 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div className="glass-card-light text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {data.totalProposals}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Proposals Sent
            </div>
          </div>
          <div className="glass-card-light text-center">
            <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">
              {data.acceptedProposals}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Accepted
            </div>
          </div>
          <div className="glass-card-light text-center">
            <div className="text-3xl font-bold text-primary-500 dark:text-primary-400 mb-2">
              {data.activeJobs}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Active Jobs
            </div>
          </div>
          <div className="glass-card-light text-center">
            <div className="text-3xl font-bold text-secondary-500 dark:text-secondary-400 mb-2">
              {data.completedJobs}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Completed
            </div>
          </div>
          <div className="glass-card-light text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              ${data.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Total Earned
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Jobs</h2>
          {data.recentJobs.length === 0 ? (
            <div className="glass-card-light text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                No active jobs yet
              </p>
              <Link
                to="/jobs"
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                Start Browsing Jobs
              </Link>
            </div>
          ) : (
            <div className="grid-responsive">
              {data.recentJobs.map((job: any) => (
                <Link
                  to={`/jobs/${job._id}`}
                  key={job._id}
                  className="glass-card-light group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`badge badge-${job.status}`}>
                      {job.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg group-hover:gradient-text transition-all mb-3">
                    {job.title}
                  </h3>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="font-bold gradient-text">
                      ${job.budget.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    {job.client && (
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {job.client.name}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

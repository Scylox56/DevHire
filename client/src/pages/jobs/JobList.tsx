import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

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
      <div className="container py-20 text-center">
        <div className="spinner mx-auto mb-4 h-8 w-8"></div>
        <p className="text-slate-600 dark:text-slate-400">
          Loading amazing opportunities...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-12">
      <div className="container">
        <div className="page-header mb-12 items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              💼 Browse Jobs
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find your next amazing project
            </p>
          </div>
          <Link
            to="/post-job"
            className="btn btn-primary flex items-center gap-2"
          >
            ➕ Post a Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="glass-card-light text-center py-16">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-xl font-semibold mb-2">
              No Open Jobs Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Check back soon for new opportunities
            </p>
            <Link to="/devs" className="btn btn-secondary">
              Explore Developers Instead
            </Link>
          </div>
        ) : (
          <div className="grid-responsive">
            {jobs.map((job) => (
              <Link
                to={`/jobs/${job._id}`}
                key={job._id}
                className="glass-card-light group cursor-pointer overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge badge-${job.status}`}>
                    {job.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-3 group-hover:gradient-text transition-all">
                  {job.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex gap-2 mb-4 flex-wrap">
                  {job.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="badge badge-primary text-xs">
                      {tech}
                    </span>
                  ))}
                  {job.techStack.length > 3 && (
                    <span className="badge bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                      +{job.techStack.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div>
                    <p className="text-2xl font-bold gradient-text">
                      ${job.budget.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Budget
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {job.timeline}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Days
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

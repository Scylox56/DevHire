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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-12">
      <div className="container max-w-2xl">
        <Link
          to="/jobs"
          className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm inline-flex items-center gap-1 mb-8"
        >
          ← Back to Jobs
        </Link>

        <div className="glass-card-light mb-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">📝 Post a New Job</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Tell developers about your project and find the perfect match
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build React E-commerce Dashboard"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Project Description</label>
              <textarea
                className="form-textarea"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project, requirements, and expectations..."
                required
              />
            </div>

            {/* Tech Stack */}
            <div className="form-group">
              <label className="form-label">Tech Stack (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB, TypeScript"
                required
              />
            </div>

            {/* Budget and Timeline */}
            <div className="grid grid-2 gap-6">
              <div className="form-group">
                <label className="form-label">Budget ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min={1}
                  placeholder="2000"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Timeline (days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  min={1}
                  placeholder="30"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center gap-2 mt-8"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner h-4 w-4"></span>
                  Posting your job...
                </>
              ) : (
                <>🚀 Post Job</>
              )}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="grid grid-2 gap-4">
          <div className="glass rounded-lg p-4">
            <span className="text-2xl block mb-2">💡</span>
            <h4 className="font-semibold mb-1">Be Specific</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Clear requirements attract qualified developers
            </p>
          </div>
          <div className="glass rounded-lg p-4">
            <span className="text-2xl block mb-2">⭐</span>
            <h4 className="font-semibold mb-1">Set Fair Budget</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Competitive budget gets better proposals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

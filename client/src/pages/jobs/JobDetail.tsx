import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  client: {
    _id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
  awardedTo?: {
    _id: string;
    name: string;
    avatar?: string;
    title?: string;
    skills?: string[];
  };
  submissionNote?: string;
  submittedAt?: string;
  createdAt: string;
}

// Reusable input class
const inputCls =
  "w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-600 rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition";

const textareaCls =
  "w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-600 rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none";

const labelCls =
  "block text-sm font-medium text-slate-900 dark:text-slate-300 mb-1";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [estimatedTimeline, setEstimatedTimeline] = useState(1);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionNote, setSubmissionNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTechStack, setEditTechStack] = useState("");
  const [deleting, setDeleting] = useState(false);

  const reloadJob = () => {
    if (!id) return;
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!id) return;
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => {
        setJob(data);
        setBidAmount(null);
        setEstimatedTimeline(data.timeline);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchProposals = async () => {
    try {
      const { data } = await api.get(`/proposals/${id}`);
      setProposals(data);
    } catch {}
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/proposals/${id}`, {
        coverLetter,
        bidAmount,
        estimatedTimeline,
      });
      toast.success("Proposal submitted!");
      setShowProposalForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit proposal");
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      await api.put(`/proposals/${proposalId}/accept`);
      toast.success("Proposal accepted!");
      reloadJob();
      fetchProposals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept");
    }
  };

  const handleOpenConversation = async () => {
    try {
      const { data } = await api.get(`/messages/conversations/job/${id}`);
      navigate("/messages", { state: { conversationId: data._id } });
    } catch {
      toast.error("Conversation not found");
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/jobs/${id}/submit-work`, { submissionNote });
      toast.success("Work submitted!");
      setShowSubmitForm(false);
      reloadJob();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit work");
    }
  };

  const handleStartEdit = () => {
    setEditTitle(job!.title);
    setEditDescription(job!.description);
    setEditTechStack((job!.techStack || []).join(", "));
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const { data } = await api.put(`/jobs/${id}`, {
        title: editTitle,
        description: editDescription,
        techStack: editTechStack
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      });
      setJob(data);
      setEditing(false);
      toast.success("Job updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update job");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted!");
      navigate("/jobs");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  };

  const handleMarkComplete = async () => {
    try {
      const { data } = await api.put(`/jobs/${id}/complete`);
      setJob(data);
      toast.success("Job marked as complete!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to mark complete");
    }
  };

  const isAwardedDev = String(user?._id) === String(job?.awardedTo?._id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <div className="spinner mx-auto mb-4 h-8 w-8"></div>
      </div>
    );
  }
  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Job not found</p>
      </div>
    );
  }

  const isOwner = String(user?._id) === String(job.client._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-12">
      <div className="container">
        <Link
          to="/jobs"
          className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors"
        >
          &larr; Back to Jobs
        </Link>

        <div className="glass-card-light mt-6">
          <div className="flex justify-between items-center mb-4">
            <span className={`badge badge-${job.status}`}>
              {job.status.replace("_", " ").toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              {isOwner && job.status === "open" && !editing && (
                <>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={handleStartEdit}
                  >
                    Edit
                  </button>
                  {deleting ? (
                    <div className="flex items-center gap-1">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setDeleting(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleting(true)}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4 mb-5">
              <div className="space-y-1">
                <label className={labelCls}>Title</label>
                <input
                  className={inputCls}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Description</label>
                <textarea
                  className={textareaCls}
                  rows={5}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Tech Stack (comma separated)</label>
                <input
                  className={inputCls}
                  value={editTechStack}
                  onChange={(e) => setEditTechStack(e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {job.techStack.map((tech) => (
                  <span key={tech} className="badge badge-primary">
                    {tech}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="avatar w-8 h-8 text-xs">{job.client.name[0]}</div>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {job.client.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  ⭐ {job.client.rating.toFixed(1)} ({job.client.reviewCount}{" "}
                  reviews)
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">
                ${job.budget.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {job.timeline} days
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          {user && !isOwner && job.status === "open" && user.role === "dev" && (
            <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                className="btn btn-primary"
                onClick={() => setShowProposalForm(!showProposalForm)}
              >
                {showProposalForm ? "Cancel" : "Submit Proposal"}
              </button>
              {showProposalForm && (
                <form
                  onSubmit={handleProposalSubmit}
                  className="mt-6 space-y-5"
                >
                  <div className="space-y-1">
                    <label className={labelCls}>Cover Letter</label>
                    <textarea
                      className={textareaCls}
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell the client why you're the best fit..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelCls}>Bid Amount ($)</label>
                      <input
                        type="number"
                        className={inputCls}
                        value={bidAmount ?? ""}
                        onChange={(e) =>
                          setBidAmount(
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                        min={1}
                        placeholder="Enter your bid amount"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>
                        Estimated Timeline (days)
                      </label>
                      <input
                        type="number"
                        className={inputCls}
                        value={estimatedTimeline}
                        onChange={(e) =>
                          setEstimatedTimeline(Number(e.target.value))
                        }
                        min={1}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Submit Proposal
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Awarded section with actions */}
          {job.awardedTo && (
            <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="glass-card bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar w-10 h-10 text-sm">
                      {job.awardedTo.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        Awarded to {job.awardedTo.name}
                      </div>
                      {job.awardedTo.title && (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {job.awardedTo.title}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(isOwner || isAwardedDev) && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleOpenConversation}
                      >
                        Send Message
                      </button>
                    )}
                    {isOwner && job.status === "in_progress" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleMarkComplete}
                      >
                        Mark Complete
                      </button>
                    )}
                    {isOwner &&
                      (job.status === "completed" ||
                        job.status === "in_progress") &&
                      job.submissionNote && (
                        <span className="badge badge-success">
                          Work Submitted
                        </span>
                      )}
                    {isAwardedDev &&
                      job.status === "in_progress" &&
                      !showSubmitForm && (
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={() => setShowSubmitForm(true)}
                        >
                          Submit Work
                        </button>
                      )}
                  </div>
                </div>
              </div>

              {/* Submit work form */}
              {isAwardedDev && showSubmitForm && (
                <form
                  onSubmit={handleSubmitWork}
                  className="mt-4 p-4 glass-card-light"
                >
                  <div className="space-y-1 mb-4">
                    <label className={labelCls}>Submission Notes</label>
                    <textarea
                      className={textareaCls}
                      rows={4}
                      value={submissionNote}
                      onChange={(e) => setSubmissionNote(e.target.value)}
                      placeholder="Describe what was completed, include links or instructions..."
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="submit" className="btn btn-success">
                      Submit Work
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setShowSubmitForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Submission display for client */}
              {isOwner && job.submissionNote && (
                <div className="mt-4 p-4 glass-card-light">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Work Submission
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {job.submissionNote}
                  </p>
                  {job.submittedAt && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Submitted on{" "}
                      {new Date(job.submittedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isOwner && job.status === "open" && (
          <div className="glass-card-light mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Proposals ({proposals.length})
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={fetchProposals}>
                Refresh
              </button>
            </div>
            {proposals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  No proposals yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((p: any) => (
                  <div key={p._id} className="glass-card-light">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar w-10 h-10 text-sm">
                          {p.dev.name[0]}
                        </div>
                        <div>
                          <Link
                            to={`/devs/${p.dev._id}`}
                            className="font-semibold text-slate-800 dark:text-slate-100 hover:text-primary-500 dark:hover:text-primary-400"
                          >
                            {p.dev.name}
                          </Link>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {p.dev.title} • ⭐ {p.dev.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg gradient-text">
                          ${p.bidAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {p.estimatedTimeline} days
                        </div>
                      </div>
                    </div>
                    {p.coverLetter && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                        {p.coverLetter}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className={`badge badge-${p.status}`}>
                        {p.status}
                      </span>
                      {p.status === "pending" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAcceptProposal(p._id)}
                        >
                          Accept Proposal
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

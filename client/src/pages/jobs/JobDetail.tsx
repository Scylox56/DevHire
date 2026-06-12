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
  hasReviewed?: boolean;
  hasProposed?: boolean;
}

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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setShowProposalForm(false);
      setShowSuccessModal(true);
      reloadJob();
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
      await api.put(`/jobs/${id}/complete`);
      toast.success("Job marked as complete!");
      reloadJob();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to mark complete");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating < 1) {
      toast.error("Please select a rating");
      return;
    }
    setReviewSubmitting(true);
    try {
      await api.post(`/reviews/${id}`, { rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted!");
      setShowReviewForm(false);
      setJob((prev) => (prev ? { ...prev, hasReviewed: true } : prev));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isAwardedDev = String(user?._id) === String(job?.awardedTo?._id);

  if (loading) {
    return (
      <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="dh-spinner"></div>
      </div>
    );
  }
  if (!job) {
    return (
      <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Job not found</p>
      </div>
    );
  }

  const isOwner = String(user?._id) === String(job.client._id);

  return (
    <div className="dh-root" style={{ padding: "48px 0" }}>
      <div className="dh-container">
        <Link to="/jobs" className="dh-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
          &larr; Back to Jobs
        </Link>

        <div className="dh-card" style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span className="dh-badge" data-status={job.status}>
              {job.status.replace("_", " ").toUpperCase()}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isOwner && job.status === "open" && !editing && (
                <>
                  <button className="dh-btn-ghost dh-btn-sm" onClick={handleStartEdit}>Edit</button>
                  {deleting ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="dh-btn-danger dh-btn-sm" onClick={handleDelete}>Confirm</button>
                      <button className="dh-btn-ghost dh-btn-sm" onClick={() => setDeleting(false)}>Cancel</button>
                    </div>
                  ) : (
                    <button className="dh-btn-danger dh-btn-sm" onClick={() => setDeleting(true)}>Delete</button>
                  )}
                </>
              )}
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              <div>
                <label className="dh-label">Title</label>
                <input className="dh-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div>
                <label className="dh-label">Description</label>
                <textarea className="dh-textarea" rows={5} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div>
                <label className="dh-label">Tech Stack (comma separated)</label>
                <input className="dh-input" value={editTechStack} onChange={(e) => setEditTechStack(e.target.value)} placeholder="React, Node.js, MongoDB" />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="dh-btn-primary dh-btn-sm" onClick={handleSaveEdit}>Save</button>
                <button className="dh-btn-ghost dh-btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.6rem", letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "0 0 12px" }}>{job.title}</h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>{job.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {job.techStack.map((tech) => (
                  <span key={tech} className="dh-pill">{tech}</span>
                ))}
              </div>
            </>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="dh-avatar dh-avatar-sm">
                {job.client.avatar ? (
                  <img src={job.client.avatar} alt={job.client.name} className="dh-avatar-img" />
                ) : (
                  job.client.name[0]
                )}
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{job.client.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  ★ {job.client.rating.toFixed(1)} ({job.client.reviewCount} reviews)
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="text-cyan" style={{ fontSize: "1.5rem", fontWeight: 700 }}>${job.budget.toLocaleString()}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{job.timeline} days</div>
            </div>
          </div>

          {/* Proposal Form */}
          {user && !isOwner && job.status === "open" && user.role === "dev" && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              {job.hasProposed ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--cyan)" }}>✓ Proposal submitted</span>
                </div>
              ) : (
                <>
              <button className="dh-btn-primary" onClick={() => {
                if (job.hasProposed) {
                  toast.error("You have already submitted a proposal for this job");
                  return;
                }
                setShowProposalForm(!showProposalForm);
              }}>
                {showProposalForm ? "Cancel" : "Submit Proposal"}
              </button>
              {showProposalForm && (
                <form onSubmit={handleProposalSubmit} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="dh-label">Cover Letter</label>
                    <textarea className="dh-textarea" rows={5} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell the client why you're the best fit..." required />
                  </div>
                  <div className="dh-grid-2">
                    <div>
                      <label className="dh-label">Bid Amount ($)</label>
                      <input type="number" className="dh-input" value={bidAmount ?? ""} onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : null)} min={1} placeholder="Enter your bid amount" required />
                    </div>
                    <div>
                      <label className="dh-label">Estimated Timeline (days)</label>
                      <input type="number" className="dh-input" value={estimatedTimeline} onChange={(e) => setEstimatedTimeline(Number(e.target.value))} min={1} required />
                    </div>
                  </div>
                  <button type="submit" className="dh-btn-success" style={{ alignSelf: "flex-start" }}>Submit Proposal</button>
                </form>
              )}
                </>
              )}
            </div>
          )}

          {/* Awarded section with actions */}
          {job.awardedTo && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <div className="dh-card" style={{ background: "rgba(0,255,209,0.03)", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="dh-avatar" style={{ width: 40, height: 40, fontSize: "0.8rem" }}>
                      {job.awardedTo.avatar ? (
                        <img src={job.awardedTo.avatar} alt={job.awardedTo.name} className="dh-avatar-img" />
                      ) : (
                        job.awardedTo.name[0]
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Awarded to {job.awardedTo.name}</div>
                      {job.awardedTo.title && <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{job.awardedTo.title}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(isOwner || isAwardedDev) && (
                      <button className="dh-btn-primary dh-btn-sm" onClick={handleOpenConversation}>Send Message</button>
                    )}
                    {isOwner && job.status === "in_progress" && (
                      <button className="dh-btn-success dh-btn-sm" onClick={handleMarkComplete}>Mark Complete</button>
                    )}
                    {isOwner && (job.status === "completed" || job.status === "in_progress") && job.submissionNote && (
                      <span className="dh-badge" data-status="completed">Work Submitted</span>
                    )}
                    {isAwardedDev && job.status === "in_progress" && !showSubmitForm && (
                      <button className="dh-btn-primary dh-btn-sm" onClick={() => setShowSubmitForm(true)}>Submit Work</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit work form */}
              {isAwardedDev && showSubmitForm && (
                <form onSubmit={handleSubmitWork} className="dh-card" style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 16 }}>
                    <label className="dh-label">Submission Notes</label>
                    <textarea className="dh-textarea" rows={4} value={submissionNote} onChange={(e) => setSubmissionNote(e.target.value)} placeholder="Describe what was completed, include links or instructions..." required />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" className="dh-btn-success">Submit Work</button>
                    <button type="button" className="dh-btn-ghost" onClick={() => setShowSubmitForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              {/* Submission display for client */}
              {isOwner && job.submissionNote && (
                <div className="dh-card" style={{ marginTop: 16 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", margin: "0 0 8px" }}>Work Submission</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "pre-wrap", margin: 0 }}>{job.submissionNote}</p>
                  {job.submittedAt && <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: 8 }}>Submitted on {new Date(job.submittedAt).toLocaleDateString()}</p>}
                </div>
              )}
            </div>
          )}

          {/* Review Form */}
          {user && job.status === "completed" && (isOwner || isAwardedDev) && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              {job.hasReviewed ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--cyan)" }}>✓ Review submitted</span>
                </div>
              ) : (
                <>
                  <button className="dh-btn-primary dh-btn-sm" onClick={() => setShowReviewForm(!showReviewForm)}>
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </button>
                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                      <div>
                        <label className="dh-label">Rating</label>
                        <div style={{ display: "flex", gap: 6 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setReviewRating(star)}
                              style={{
                                cursor: "pointer",
                                fontSize: "1.6rem",
                                color: star <= reviewRating ? "var(--cyan)" : "var(--text-dim)",
                                transition: "color 0.15s",
                                userSelect: "none",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="dh-label">Comment (optional)</label>
                        <textarea
                          className="dh-textarea"
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your feedback about working together..."
                        />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="submit" className="dh-btn-primary dh-btn-sm" disabled={reviewSubmitting || reviewRating < 1}>
                          {reviewSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                        <button type="button" className="dh-btn-ghost dh-btn-sm" onClick={() => setShowReviewForm(false)}>Cancel</button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {isOwner && job.status === "open" && (
          <div className="dh-card" style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)", margin: 0 }}>
                Proposals ({proposals.length})
              </h2>
              <button className="dh-btn-ghost dh-btn-sm" onClick={fetchProposals}>Refresh</button>
            </div>
            {proposals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <p style={{ color: "var(--text-dim)" }}>No proposals yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {proposals.map((p: any) => (
                  <div key={p._id} className="dh-card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="dh-avatar" style={{ width: 40, height: 40, fontSize: "0.8rem" }}>
                          {p.dev.avatar ? (
                            <img src={p.dev.avatar} alt={p.dev.name} className="dh-avatar-img" />
                          ) : (
                            p.dev.name[0]
                          )}
                        </div>
                        <div>
                          <Link to={`/devs/${p.dev._id}`} className="dh-link" style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.dev.name}</Link>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{p.dev.title} • ★ {p.dev.rating.toFixed(1)}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="text-cyan" style={{ fontWeight: 700, fontSize: "1.05rem" }}>${p.bidAmount.toLocaleString()}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{p.estimatedTimeline} days</div>
                      </div>
                    </div>
                    {p.coverLetter && (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 12 }}>{p.coverLetter}</p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                      <span className="dh-badge" data-status={p.status}>{p.status}</span>
                      {p.status === "pending" && (
                        <button className="dh-btn-success dh-btn-sm" onClick={() => handleAcceptProposal(p._id)}>Accept Proposal</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showSuccessModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="dh-card"
            style={{ maxWidth: 440, width: "90%", textAlign: "center", padding: 40 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-cyan" style={{ fontSize: "2.5rem", marginBottom: 16, fontWeight: 700 }}>✓</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--text-primary)", margin: "0 0 8px" }}>
              Proposal Submitted!
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 24px" }}>
              Your proposal has been sent to the client. They'll review it and may reach out via messages if interested.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setShowSuccessModal(false)} className="dh-btn-primary">
                Got it
              </button>
              <button onClick={() => { setShowSuccessModal(false); navigate("/messages"); }} className="dh-btn-ghost">
                View Messages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

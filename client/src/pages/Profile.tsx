import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

interface PortfolioItem {
  title: string;
  url: string;
  description?: string;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [avatar, setAvatar] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    api.get("/auth/me").then(({ data }) => {
      setProfileData(data);
      setName(data.name || "");
      setTitle(data.title || "");
      setBio(data.bio || "");
      setSkills((data.skills || []).join(", "));
      setHourlyRate(data.hourlyRate ? String(data.hourlyRate) : "");
      setAvatar(data.avatar || "");
      setPortfolio(data.portfolio || []);
      setFetching(false);
    }).catch(() => {
      toast.error("Failed to load profile");
      setFetching(false);
    });
  }, [user]);

  const addPortfolioItem = () => {
    setPortfolio([...portfolio, { title: "", url: "", description: "" }]);
  };

  const removePortfolioItem = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const updatePortfolioItem = (index: number, field: keyof PortfolioItem, value: string) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanedPortfolio = portfolio.filter((p) => p.title || p.url);
      const { data } = await api.put("/auth/profile", {
        name,
        title,
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
        avatar,
        portfolio: cleanedPortfolio,
      });
      updateUser(data);
      setProfileData(data);
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = String(user?._id) === String(profileData?._id);

  if (fetching) {
    return (
      <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="dh-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dh-root" style={{ padding: "48px 0" }}>
      <div className="dh-container" style={{ maxWidth: 640 }}>
        <div className="dh-card">
          {editing ? (
            <>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div className="dh-avatar" style={{ width: 64, height: 64, fontSize: "1.25rem" }}>
                    {avatar ? (
                      <img src={avatar} alt={name} className="dh-avatar-img" />
                    ) : (
                      name[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <h1 className="dh-page-header-title" style={{ margin: 0 }}>{name}</h1>
                    <span className="dh-pill" style={{ marginTop: 4, display: "inline-flex" }}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="dh-page-header-sub">Update your profile information</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="dh-form-group">
                  <label className="dh-label">Full Name</label>
                  <input type="text" className="dh-input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="dh-form-group">
                  <label className="dh-label">Professional Title</label>
                  <input type="text" className="dh-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Full-Stack Developer" />
                </div>

                <div className="dh-form-group">
                  <label className="dh-label">Bio</label>
                  <textarea className="dh-textarea" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell others about yourself..." />
                </div>

                <div className="dh-form-group">
                  <label className="dh-label">Skills (comma-separated)</label>
                  <input type="text" className="dh-input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, Node.js, TypeScript, MongoDB" />
                </div>

                {user?.role === "dev" && (
                  <div className="dh-form-group">
                    <label className="dh-label">Hourly Rate ($)</label>
                    <input type="number" className="dh-input" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} min={0} placeholder="50" />
                  </div>
                )}

                <div className="dh-form-group">
                  <label className="dh-label">Avatar URL</label>
                  <input type="url" className="dh-input" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://example.com/avatar.jpg" />
                </div>

                <div className="dh-form-group">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <label className="dh-label" style={{ marginBottom: 0 }}>Portfolio</label>
                    <button type="button" className="dh-btn-ghost dh-btn-sm" onClick={addPortfolioItem}>+ Add Item</button>
                  </div>
                  {portfolio.map((item, index) => (
                    <div key={index} className="dh-card" style={{ padding: 20, marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-dim)" }}>Item #{index + 1}</span>
                        <button type="button" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--crimson)", background: "none", border: "none", cursor: "pointer" }} onClick={() => removePortfolioItem(index)}>Remove</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <input type="text" className="dh-input" value={item.title} onChange={(e) => updatePortfolioItem(index, "title", e.target.value)} placeholder="Project title" />
                        <input type="url" className="dh-input" value={item.url} onChange={(e) => updatePortfolioItem(index, "url", e.target.value)} placeholder="https://..." />
                        <textarea className="dh-textarea" rows={2} value={item.description || ""} onChange={(e) => updatePortfolioItem(index, "description", e.target.value)} placeholder="Brief description" />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" className="dh-btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={loading}>
                    {loading ? (
                      <>
                        <span className="dh-spinner dh-spinner-sm"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button type="button" className="dh-btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
                <div className="dh-avatar" style={{ width: 64, height: 64, fontSize: "1.25rem", flexShrink: 0 }}>
                  {profileData?.avatar ? (
                    <img src={profileData.avatar} alt={profileData.name} className="dh-avatar-img" />
                  ) : (
                    profileData?.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 }}>
                      {profileData?.name}
                    </h1>
                    <span className="dh-pill" style={{ display: "inline-flex" }}>
                      {profileData?.role?.toUpperCase()}
                    </span>
                  </div>
                  {profileData?.title && (
                    <div style={{ fontSize: "0.95rem", color: "var(--text-dim)", marginTop: 4 }}>{profileData.title}</div>
                  )}
                  {(profileData?.rating || profileData?.rating === 0) && profileData?.reviewCount !== undefined && (
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 6 }}>
                      ★ {profileData.rating.toFixed(1)} ({profileData.reviewCount} reviews)
                    </div>
                  )}
                </div>
                {isOwner && (
                  <button className="dh-btn-primary dh-btn-sm" onClick={() => setEditing(true)} style={{ flexShrink: 0 }}>
                    Edit Profile
                  </button>
                )}
              </div>

              {profileData?.bio && (
                <>
                  <h3 className="dh-eyebrow" style={{ marginBottom: 8 }}>About</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 24 }}>{profileData.bio}</p>
                </>
              )}

              {profileData?.skills?.length > 0 && (
                <>
                  <h3 className="dh-eyebrow" style={{ marginBottom: 8 }}>Skills</h3>
                  <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                    {profileData.skills.map((s: string) => (
                      <span key={s} className="dh-pill">{s}</span>
                    ))}
                  </div>
                </>
              )}

              {profileData?.role === "dev" && profileData?.hourlyRate && (
                <div style={{ marginBottom: 24 }}>
                  <h3 className="dh-eyebrow" style={{ marginBottom: 8 }}>Hourly Rate</h3>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--cyan)", margin: 0 }}>
                    ${profileData.hourlyRate}/hr
                  </p>
                </div>
              )}

              {profileData?.portfolio?.length > 0 && (
                <>
                  <h3 className="dh-eyebrow" style={{ marginBottom: 12 }}>Portfolio</h3>
                  <div className="dh-grid-2" style={{ marginBottom: 8 }}>
                    {profileData.portfolio.map((p: PortfolioItem, i: number) => (
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

              {!profileData?.bio && (!profileData?.skills || profileData.skills.length === 0) && (
                <div className="dh-empty">
                  <h3 className="dh-empty-title">Profile Incomplete</h3>
                  <p className="dh-empty-text">Add your bio, skills, and portfolio to showcase your profile</p>
                  {isOwner && (
                    <button className="dh-btn-primary" onClick={() => setEditing(true)}>Complete Profile</button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

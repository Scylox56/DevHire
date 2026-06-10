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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [avatar, setAvatar] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get("/auth/me").then(({ data }) => {
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
      toast.success("Profile updated!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <div className="spinner mx-auto mb-4 h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-12">
      <div className="container max-w-2xl">
        <div className="glass-card-light mb-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar w-16 h-16 text-xl">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  name[0]?.toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <span className={`badge ${user?.role === "client" ? "badge-primary" : "badge-success"}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Update your profile information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Full-Stack Developer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, TypeScript, MongoDB"
              />
            </div>

            {user?.role === "dev" && (
              <div className="form-group">
                <label className="form-label">Hourly Rate ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  min={0}
                  placeholder="50"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <input
                type="url"
                className="form-input"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Portfolio */}
            <div className="form-group">
              <div className="flex items-center justify-between mb-2">
                <label className="form-label mb-0">Portfolio</label>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addPortfolioItem}>
                  + Add Item
                </button>
              </div>
              {portfolio.map((item, index) => (
                <div key={index} className="glass p-4 rounded-xl mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Item #{index + 1}
                    </span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                      onClick={() => removePortfolioItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="form-input"
                      value={item.title}
                      onChange={(e) => updatePortfolioItem(index, "title", e.target.value)}
                      placeholder="Project title"
                    />
                    <input
                      type="url"
                      className="form-input"
                      value={item.url}
                      onChange={(e) => updatePortfolioItem(index, "url", e.target.value)}
                      placeholder="https://..."
                    />
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={item.description || ""}
                      onChange={(e) => updatePortfolioItem(index, "description", e.target.value)}
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner h-4 w-4"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

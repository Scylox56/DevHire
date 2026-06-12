import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"dev" | "client">("dev");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dh-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div className="w-full" style={{ maxWidth: 420 }}>
        <div className="dh-card">
          <div className="text-center" style={{ marginBottom: 32 }}>
            <h1 className="dh-heading" style={{ fontSize: "1.8rem", margin: "0 0 8px" }}>
              Join DevHire
            </h1>
            <p className="dh-sub" style={{ maxWidth: "none", fontSize: "0.9rem" }}>
              Create your account and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="dh-form-group">
              <label className="dh-label">Full Name</label>
              <input
                type="text"
                className="dh-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="dh-form-group">
              <label className="dh-label">Email Address</label>
              <input
                type="email"
                className="dh-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="dh-form-group">
              <label className="dh-label">Password</label>
              <input
                type="password"
                className="dh-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="dh-hint">At least 6 characters</p>
            </div>

            <div className="dh-form-group">
              <label className="dh-label">I am a</label>
              <select
                className="dh-select"
                value={role}
                onChange={(e) => setRole(e.target.value as "dev" | "client")}
              >
                <option value="dev">Developer</option>
                <option value="client">Client</option>
              </select>
            </div>

            <button
              type="submit"
              className="dh-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="dh-spinner dh-spinner-sm"></span>
                  Creating account...
                </>
              ) : (
                <>Create Account</>
              )}
            </button>
          </form>

          <div className="dh-divider"></div>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
            Already have an account?{" "}
            <Link to="/login" className="dh-link" style={{ color: "var(--cyan)" }}>
              Sign in
            </Link>
          </p>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="dh-chip">
            Your data is secure and encrypted
          </div>
          <div className="dh-chip">
            Start working immediately after signup
          </div>
          <div className="dh-chip">
            Connect with talented developers worldwide
          </div>
        </div>
      </div>
    </div>
  );
}

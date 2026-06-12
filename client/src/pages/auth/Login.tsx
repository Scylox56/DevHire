import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
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
              Welcome Back
            </h1>
            <p className="dh-sub" style={{ maxWidth: "none", fontSize: "0.9rem" }}>
              Sign in to your DevHire account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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
                  Signing in...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          <div className="dh-divider"></div>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
            Don't have an account?{" "}
            <Link to="/register" className="dh-link" style={{ color: "var(--cyan)" }}>
              Create one
            </Link>
          </p>
        </div>

        <div className="dh-grid-2" style={{ marginTop: 16, gap: 12 }}>
          <div className="dh-chip" style={{ justifyContent: "center" }}>
            For Developers
          </div>
          <div className="dh-chip" style={{ justifyContent: "center" }}>
            For Clients
          </div>
        </div>
      </div>
    </div>
  );
}

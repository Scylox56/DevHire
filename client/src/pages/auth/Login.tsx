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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center py-12 px-4">
      {/* Background animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-card-light mb-6">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">🔐</span>
            <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Sign in to your DevHire account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner h-4 w-4"></span>
                  Signing in...
                </>
              ) : (
                <>🚀 Sign In</>
              )}
            </button>
          </form>

          <div className="divider"></div>

          <p className="text-center text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-semibold"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="glass rounded-lg p-4 text-center text-sm text-slate-600 dark:text-slate-400">
            <span className="text-xl block mb-1">💼</span>
            For Developers
          </div>
          <div className="glass rounded-lg p-4 text-center text-sm text-slate-600 dark:text-slate-400">
            <span className="text-xl block mb-1">👨‍💼</span>
            For Clients
          </div>
        </div>
      </div>
    </div>
  );
}

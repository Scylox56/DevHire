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
            <span className="text-5xl block mb-3">🎨</span>
            <h1 className="text-3xl font-bold gradient-text">Join DevHire</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Create your account and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                At least 6 characters
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">I am a</label>
              <select
                className="form-select text-slate-900 dark:text-slate-100"
                value={role}
                onChange={(e) => setRole(e.target.value as "dev" | "client")}
              >
                <option value="dev" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">🚀 Developer</option>
                <option value="client" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">👨‍💼 Client</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner h-4 w-4"></span>
                  Creating account...
                </>
              ) : (
                <>✨ Create Account</>
              )}
            </button>
          </form>

          <div className="divider"></div>

          <p className="text-center text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-3 mt-6">
          <div className="glass rounded-lg p-3 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-lg flex-shrink-0">🔒</span>
            <span>Your data is secure and encrypted</span>
          </div>
          <div className="glass rounded-lg p-3 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-lg flex-shrink-0">⚡</span>
            <span>Start working immediately after signup</span>
          </div>
          <div className="glass rounded-lg p-3 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-lg flex-shrink-0">🌍</span>
            <span>Connect with talented developers worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}

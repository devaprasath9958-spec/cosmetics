import { useState } from "react";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { useAdminAuth } from "../../contexts/AdminAuthContext.jsx";
import { ADMIN_CREDENTIALS } from "../../data/adminSeed.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-obsidian">
      <div className="max-w-md w-full bg-obsidian-light border border-obsidian-border rounded-xl p-8 shadow-card relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 border border-gold/30 text-gold">
              <Shield size={22} />
            </div>
            <h1 className="font-display text-3xl mb-2 text-ivory">Admin Portal</h1>
            <p className="text-smoke text-sm">Sign in to manage the LUMÉ storefront.</p>
          </div>

          {error && (
            <p className="mb-4 rounded-xl border border-rose/30 bg-rose-deep/10 px-4 py-3 text-xs text-rose">
              {error}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-ivory">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg pl-10 pr-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                  placeholder={ADMIN_CREDENTIALS.email}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-ivory">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg pl-10 pr-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group"
            >
              Access Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-smoke/80">
            Demo: {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}
          </p>

          <p className="mt-4 text-center text-sm text-smoke">
            <Link to="/" className="text-gold hover:text-gold-light font-medium transition-colors">
              ← Back to Store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

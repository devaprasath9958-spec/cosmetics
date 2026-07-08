import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAdminAuth } from "../contexts/AdminAuthContext.jsx";
import { ADMIN_CREDENTIALS } from "../data/adminSeed.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login: adminLogin } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Automatic Admin Login Detection
    if (formData.email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()) {
      const adminResult = adminLogin(formData.email, formData.password);
      setLoading(false);
      if (adminResult.success) {
        navigate("/admin", { replace: true });
      } else {
        setError(adminResult.error);
      }
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-obsidian-light border border-obsidian-border rounded-xl p-8 shadow-card relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl mb-2 text-ivory">Welcome Back</h1>
            <p className="text-smoke text-sm">Sign in to access your Lumé account.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-deep/20 border border-rose/30 text-rose text-sm rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-ivory">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg pl-10 pr-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-ivory">Password</label>
                <Link to="#" className="text-xs text-gold hover:text-gold-light transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg pl-10 pr-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-smoke">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gold hover:text-gold-light font-medium transition-colors">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

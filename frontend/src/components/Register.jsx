import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
        }
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data?.user && !data?.session) {
      // Email confirmation is still required
      setSuccess(true);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-obsidian-light border border-obsidian-border rounded-xl p-8 shadow-card relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl mb-2 text-ivory">Create Account</h1>
            <p className="text-smoke text-sm">Join Lumé to enjoy exclusive benefits.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-deep/20 border border-rose/30 text-rose text-sm rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-gold/10 border border-gold/30 text-gold text-sm rounded-lg text-center">
              <p className="font-semibold mb-1">Account created! 🎉</p>
              <p className="text-xs text-smoke">Check your email inbox and click the confirmation link, then <Link to="/login" className="text-gold underline">sign in here</Link>.</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-ivory">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg pl-10 pr-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                  placeholder="John Doe"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke w-5 h-5" />
              </div>
            </div>

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
              <label className="block text-sm font-medium mb-2 text-ivory">Password</label>
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
              {loading ? "Creating..." : "Sign Up"}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-smoke">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:text-gold-light font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

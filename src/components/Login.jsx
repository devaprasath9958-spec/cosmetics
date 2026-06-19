import React from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
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

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-2 text-ivory">Email</label>
              <div className="relative">
                <input
                  type="email"
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
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-smoke">
            Don't have an account?{" "}
            <Link to="/register" className="text-gold hover:text-gold-light font-medium transition-colors">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

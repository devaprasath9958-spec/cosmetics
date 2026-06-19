import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-9xl text-gold/20 font-bold mb-4">404</h1>
        <h2 className="font-display text-4xl text-ivory mb-4">Page Not Found</h2>
        <p className="text-smoke max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-obsidian px-8 py-3 rounded-full font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}

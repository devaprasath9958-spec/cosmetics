import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

/**
 * ProtectedRoute
 * Wraps any page that requires the user to be logged in.
 * - Shows nothing while the session is being resolved (auth loading state).
 * - Redirects to /login with `state.from` set so Login can navigate back on success.
 * - Renders children when the user is authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for Supabase session check before deciding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Preserve the destination so Login can redirect back after success
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return children;
}

import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { AnimatePresence, motion } from "framer-motion";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Reusable Auth Guard Function
  const requireAuth = (message) => {
    if (!user) {
      showToast(message);
      // Navigate to login and save the current location
      navigate("/login", { state: { from: location.pathname + location.search } });
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, requireAuth, showToast }}>
      {children}
      
      {/* Simple Toast UI */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-3 rounded-full bg-obsidian border border-gold/30 px-6 py-3 shadow-lg shadow-gold/10"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold text-sm font-bold">
              !
            </span>
            <span className="text-sm font-medium text-ivory">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";
import { motion } from "framer-motion";

const dots = ["#C9A769", "#D98C9B", "#8B3A4B", "#E2C893"];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
        className="relative overflow-hidden rounded-[3rem] border border-ivory/10 bg-obsidian-light/40 px-8 py-16 text-center shadow-2xl backdrop-blur-xl sm:px-16"
      >
        <div className="absolute inset-0 bg-radial-fade opacity-50" aria-hidden="true" />
        <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[100px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-6 flex justify-center gap-2"
        >
          {dots.map((c, i) => (
            <motion.div 
              key={c}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShadeSwatch color={c} size="sm" />
            </motion.div>
          ))}
        </motion.div>

        <h2 className="relative font-display text-4xl text-ivory sm:text-5xl">
          Join the Inner Circle
        </h2>
        <p className="relative mx-auto mt-5 max-w-md text-lg text-smoke">
          Early access to new drops, formulation notes, and rituals we don&rsquo;t
          publish anywhere else.
        </p>

        {submitted ? (
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mt-8 font-display text-xl text-gold"
          >
            You&rsquo;re on the list. Welcome in.
          </motion.p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1 group">
              <Mail
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-smoke transition-colors group-focus-within:text-gold"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-ivory/20 bg-obsidian/60 px-12 py-3.5 text-sm text-ivory placeholder:text-smoke/60 backdrop-blur-md focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-obsidian transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,167,105,0.4)] hover:-translate-y-0.5"
            >
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        )}

        <p className="relative mt-6 text-xs text-smoke/70">
          No spam. Unsubscribe whenever you like.
        </p>
      </motion.div>
    </section>
  );
}

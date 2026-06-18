import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";

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
      <div className="relative overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/60 px-8 py-14 text-center sm:px-16">
        <div className="absolute inset-0 bg-radial-fade" aria-hidden="true" />

        <div className="relative mb-5 flex justify-center gap-2">
          {dots.map((c) => (
            <ShadeSwatch key={c} color={c} size="sm" />
          ))}
        </div>

        <h2 className="relative font-display text-3xl text-ivory sm:text-4xl">
          Join the Inner Circle
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-smoke">
          Early access to new drops, formulation notes, and rituals we don&rsquo;t
          publish anywhere else.
        </p>

        {submitted ? (
          <p className="relative mt-8 font-medium text-gold">
            You&rsquo;re on the list. Welcome in.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-obsidian-border bg-obsidian px-11 py-3 text-sm text-ivory placeholder:text-smoke focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-obsidian transition-all hover:bg-gold-light hover:shadow-glow"
            >
              Subscribe <ArrowRight size={15} />
            </button>
          </form>
        )}

        <p className="relative mt-5 text-xs text-smoke">
          No spam. Unsubscribe whenever you like.
        </p>
      </div>
    </section>
  );
}

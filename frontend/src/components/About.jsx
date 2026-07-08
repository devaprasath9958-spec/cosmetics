import { Sparkles, Leaf, Eye, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 animate-fade-up">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold font-medium">About Us</span>
        </div>
        <span className="text-[10px] text-smoke italic">Our Story</span>
      </div>

      {/* Hero Section */}
      <div className="relative mb-20 overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/40 p-8 md:p-16 text-center">
        <div className="absolute inset-0 bg-radial-fade blur-3xl opacity-50 -z-10" />
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-gold">
            <Sparkles size={14} className="animate-pulse" />
            <span>Conscious Luxury</span>
          </div>
          <h1 className="font-display text-4xl font-normal italic tracking-wide text-ivory sm:text-6xl leading-tight">
            Formulated for Radiance,<br />Crafted with Intent
          </h1>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-smoke max-w-2xl mx-auto">
            LUMÉ was founded on a singular premise: that high-performance cosmetics should enrich your skin and protect the Earth — without compromise.
          </p>
        </div>
      </div>

      {/* Editorial Story Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 mb-24 items-center">
        {/* Left Column: Visual Swatch and Brand Motif */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl border border-obsidian-border bg-obsidian-light/60 p-6 flex flex-col justify-between overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-deep/10 via-transparent to-gold/10 opacity-70" />
            
            {/* Elegant abstract shape resembling cream smudge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl opacity-60 mix-blend-screen bg-radial-gradient animate-pulse"
              style={{
                background: "radial-gradient(circle, rgba(201,167,105,0.2) 0%, rgba(139,58,75,0.2) 100%)"
              }}
            />

            <div className="z-10 flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-widest text-smoke font-semibold">Est. 2026</span>
              <Sparkles size={18} className="text-gold" />
            </div>

            {/* Middle logo mark */}
            <div className="z-10 text-center py-10">
              <span className="font-display text-7xl italic tracking-wider text-ivory/15 select-none block">LUMÉ</span>
              <span className="text-xs uppercase tracking-widest2 text-gold block mt-2">The Beauty Ritual</span>
            </div>

            <div className="z-10 border-t border-obsidian-border/60 pt-4 text-left">
              <p className="text-xs text-smoke font-mono leading-relaxed">
                N° 42.109 / NEW YORK LABS<br />
                DERMATOLOGICALLY VERIFIED CLEAN FORMULAS
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Text */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl text-ivory font-normal">
              A New Standard of Vanity
            </h2>
            <p className="text-sm md:text-base text-smoke leading-relaxed">
              Our journey began in a small botanical lab in New York. Disillusioned by mainstream cosmetics that relied heavily on synthetic silicones, heavy metals, and aggressive preservatives, our team of dermatologists and chemists set out to write a new narrative.
            </p>
            <p className="text-sm md:text-base text-smoke leading-relaxed">
              We spent three years mapping bio-active molecules, sourcing fair-trade plant extracts, and refining natural mineral pigments. The result is a curated suite of cosmetic rituals that fuse luxury textures, active hydration, and rich color pay-offs.
            </p>
          </div>

          <div className="border-l-2 border-gold/40 pl-6 py-2">
            <p className="font-display text-lg italic text-ivory/95 leading-relaxed">
              "We don't believe in concealing your natural texture. Our formulas are designed to melt into your skin, enhancing your skin barrier while letting your real, unique radiance breathe through."
            </p>
            <span className="text-xs uppercase tracking-widest text-gold block mt-3 font-semibold">— Dr. Chloe Mercer, Lead Formulator</span>
          </div>
        </div>
      </div>

      {/* Brand Pillars / Values Grid */}
      <div className="border-t border-obsidian-border pt-20 mb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl text-ivory">Our Sacred Pillars</h2>
          <p className="text-sm text-smoke mt-2 max-w-md mx-auto">
            The uncompromising standards that guide every formula we develop, bottle, and deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Leaf,
              title: "Circular Eco-Luxury",
              desc: "We house our formulas in 100% recyclable post-consumer recycled glass and print our boxes on FSC-certified sustainable papers with soy ink."
            },
            {
              icon: Heart,
              title: "Certified Cruelty-Free",
              desc: "LUMÉ has never tested, and will never test, any ingredient or finished formula on animals. We are certified by global animal advocacy groups."
            },
            {
              icon: ShieldCheck,
              title: "Dermatological Efficacy",
              desc: "Every batch is clinically tested to ensure safety for sensitive skins. We substitute synthetic fillers with therapeutic skin-barrier lipids."
            },
            {
              icon: Eye,
              title: "Uncompromising Honesty",
              desc: "100% ingredient transparency. We list every single element in our formulas, with zero hidden chemical additives or artificial fragrance masks."
            }
          ].map((pillar, i) => (
            <div key={i} className="rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6 space-y-4 transition-colors hover:border-gold/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-obsidian-soft border border-obsidian-border text-gold">
                <pillar.icon size={22} />
              </div>
              <h3 className="font-display text-lg text-ivory font-medium">{pillar.title}</h3>
              <p className="text-xs leading-relaxed text-smoke">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Timeline */}
      <div className="border-t border-obsidian-border pt-20 mb-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl text-ivory">The Evolution</h2>
          <p className="text-sm text-smoke mt-2 max-w-sm mx-auto">
            How we evolved from a single skincare serum to an international house of cosmetics.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto pl-8 sm:pl-0">
          {/* Vertical line connector */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-obsidian-border -translate-x-1/2" />

          {[
            { year: "2024", title: "The Spark", desc: "A team of three dermatologists gathers in a Soho basement to extract active botanicals using clean, cold-pressed micro-technology." },
            { year: "2025", title: "Formulating Clean Beauty", desc: "Our first release, the Dew Drop Serum, goes viral among beauty connoisseurs for its hybrid skincare-makeup radiance." },
            { year: "2026", title: "Establishing the House", desc: "LUMÉ launches its full cosmetics, lips, and hair range, introducing eco-luxury refills and shipping worldwide." }
          ].map((milestone, i) => (
            <div key={i} className={`relative mb-12 sm:mb-16 flex flex-col sm:flex-row items-start sm:items-center ${i % 2 === 0 ? "sm:flex-row-reverse" : ""}`}>
              {/* Central point marker */}
              <div className="absolute left-0 sm:left-1/2 top-1.5 sm:top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-gold bg-obsidian text-[10px] font-bold text-gold shadow-glow">
                {milestone.year}
              </div>

              {/* Text box */}
              <div className={`w-full sm:w-[45%] pl-8 sm:pl-0 ${i % 2 === 0 ? "sm:text-left" : "sm:text-right"}`}>
                <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/45 p-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">{milestone.year} Milestone</span>
                  <h4 className="font-display text-lg text-ivory font-medium">{milestone.title}</h4>
                  <p className="text-xs leading-relaxed text-smoke">{milestone.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

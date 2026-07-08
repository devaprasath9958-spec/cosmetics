import { useState, useEffect } from "react";
import { fetchBrands } from "../services/api.js";
import { motion } from "framer-motion";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands().then(setBrands);
  }, []);

  const looped = [...brands, ...brands];

  return (
    <section className="relative border-y border-obsidian-border bg-obsidian-soft/30 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-radial-fade opacity-30" aria-hidden="true" />
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center text-xs font-semibold uppercase tracking-widest2 text-smoke"
      >
        Trusted alongside
      </motion.p>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-obsidian to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-obsidian to-transparent" />

        <div className="flex w-max animate-marquee gap-20">
          {looped.map((brand, i) => (
            <span
              key={brand + i}
              className="font-display text-2xl italic tracking-wide text-ivory/30 transition-all duration-500 hover:text-gold hover:text-shadow-glow"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


import { brands } from "../data/products.js";

export default function Brands() {
  const looped = [...brands, ...brands];

  return (
    <section className="border-y border-obsidian-border py-12">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest2 text-smoke">
        Trusted alongside
      </p>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-obsidian to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-obsidian to-transparent" />

        <div className="flex w-max animate-marquee gap-16">
          {looped.map((brand, i) => (
            <span
              key={brand + i}
              className="font-display text-xl italic tracking-wide text-ivory/40 transition-colors hover:text-gold"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

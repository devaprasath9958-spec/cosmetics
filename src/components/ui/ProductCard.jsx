import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import BottleIllustration from "./BottleIllustration.jsx";
import StarRating from "./StarRating.jsx";

const badgeStyles = {
  Bestseller: "bg-gold/15 text-gold border-gold/30",
  Sale: "bg-rose-deep/20 text-rose border-rose/30",
  New: "bg-ivory/10 text-ivory border-ivory/20",
  Limited: "bg-rose-deep/20 text-rose border-rose/30",
};

export default function ProductCard({ product }) {
  const [saved, setSaved] = useState(false);
  const { name, subtitle, price, oldPrice, rating, reviews, badge, bottle, colors } =
    product;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card">
      <div className="relative mb-5 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-obsidian-soft">
        <div className="absolute h-32 w-32 rounded-full bg-radial-fade blur-2xl" />
        <BottleIllustration
          variant={bottle}
          from={colors[0]}
          to={colors[1]}
          className="relative z-10 h-36 w-auto drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
        />

        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[badge]}`}
          >
            {badge}
          </span>
        )}

        <button
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/70 backdrop-blur transition-colors hover:bg-obsidian"
        >
          <Heart
            size={15}
            className={saved ? "fill-rose text-rose" : "text-ivory/70"}
          />
        </button>
      </div>

      <h3 className="font-display text-lg text-ivory">{name}</h3>
      <p className="mt-1 text-sm text-smoke">{subtitle}</p>

      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={rating} />
        <span className="text-xs text-smoke">({reviews})</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl text-ivory">${price}</span>
          {oldPrice && (
            <span className="text-sm text-smoke line-through">${oldPrice}</span>
          )}
        </div>

        <button
          className="flex items-center gap-1.5 rounded-full bg-ivory/5 px-3.5 py-2 text-xs font-semibold text-ivory opacity-100 transition-all duration-300 hover:bg-gold hover:text-obsidian sm:opacity-0 sm:group-hover:opacity-100"
          aria-label={`Add ${name} to bag`}
        >
          <ShoppingBag size={14} />
          Add
        </button>
      </div>
    </div>
  );
}

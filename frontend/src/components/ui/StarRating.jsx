import { Star } from "lucide-react";

export default function StarRating({ rating = 5, size = 14 }) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {stars.map((i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={filled ? "fill-gold text-gold" : "text-obsidian-border"}
          />
        );
      })}
    </div>
  );
}

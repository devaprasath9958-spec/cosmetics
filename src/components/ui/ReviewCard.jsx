import { Quote } from "lucide-react";
import ShadeSwatch from "./ShadeSwatch.jsx";
import StarRating from "./StarRating.jsx";

export default function ReviewCard({ review }) {
  const { name, location, rating, quote, swatch } = review;

  return (
    <div className="flex flex-col rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-7 transition-all duration-300 hover:border-gold/30">
      <Quote size={22} className="mb-4 text-gold/50" />
      <p className="flex-1 text-ivory/90 leading-relaxed">&ldquo;{quote}&rdquo;</p>

      <div className="mt-6 flex items-center gap-3 border-t border-obsidian-border pt-5">
        <ShadeSwatch color={swatch} size="lg" ring />
        <div>
          <p className="text-sm font-semibold text-ivory">{name}</p>
          <p className="text-xs text-smoke">{location}</p>
        </div>
        <div className="ml-auto">
          <StarRating rating={rating} size={13} />
        </div>
      </div>
    </div>
  );
}

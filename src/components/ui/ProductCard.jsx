import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Check, Eye } from "lucide-react";
import BottleIllustration from "./BottleIllustration.jsx";
import StarRating from "./StarRating.jsx";
import QuickViewModal from "./QuickViewModal.jsx";

const badgeStyles = {
  Bestseller: "bg-gold/15 text-gold border-gold/30",
  Sale: "bg-rose-deep/20 text-rose border-rose/30",
  New: "bg-ivory/10 text-ivory border-ivory/20",
  Limited: "bg-rose-deep/20 text-rose border-rose/30",
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { id, name, subtitle, price, oldPrice, rating, reviews, badge, bottle, colors } =
    product;

  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  useEffect(() => {
    const checkSaved = () => {
      try {
        const stored = localStorage.getItem("lume-wishlist");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSaved(parsed.some((item) => item.id === id));
        } else {
          setSaved(false);
        }
      } catch (e) {
        setSaved(false);
      }
    };
    checkSaved();
    window.addEventListener("wishlist-updated", checkSaved);
    window.addEventListener("storage", checkSaved);
    return () => {
      window.removeEventListener("wishlist-updated", checkSaved);
      window.removeEventListener("storage", checkSaved);
    };
  }, [id]);

  const handleToggleSave = (e) => {
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("lume-wishlist");
      let list = stored ? JSON.parse(stored) : [];
      const exists = list.some((item) => item.id === id);
      
      if (exists) {
        list = list.filter((item) => item.id !== id);
      } else {
        list.push(product);
      }
      
      localStorage.setItem("lume-wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("lume-cart");
      let cart = [];
      if (stored) {
        cart = JSON.parse(stored);
      }
      
      const existingItemIdx = cart.findIndex(
        (item) => item.id === id && item.selectedShadeIndex === 0
      );
      
      if (existingItemIdx > -1) {
        cart[existingItemIdx].qty += 1;
      } else {
        cart.push({
          id,
          name,
          subtitle,
          price,
          qty: 1,
          bottle: bottle || "bottle",
          colors: colors || ["#C9A769", "#8B3A4B"],
          selectedShadeIndex: 0
        });
      }
      
      localStorage.setItem("lume-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="group relative flex cursor-pointer flex-col rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card"
    >
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
          onClick={handleToggleSave}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/70 backdrop-blur transition-colors hover:bg-obsidian"
        >
          <Heart
            size={15}
            className={saved ? "fill-rose text-rose animate-pulse" : "text-ivory/70"}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickView(true);
          }}
          aria-label="Quick view"
          className="absolute right-3 top-14 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/70 backdrop-blur transition-colors hover:bg-obsidian opacity-0 group-hover:opacity-100"
        >
          <Eye size={15} className="text-ivory/70 hover:text-gold" />
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
          onClick={handleAdd}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 ${
            added
              ? "bg-rose-deep text-rose border border-rose/30"
              : "bg-ivory/5 text-ivory hover:bg-gold hover:text-obsidian"
          }`}
          aria-label={`Add ${name} to bag`}
        >
          {added ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              Add
            </>
          )}
        </button>
      </div>

      {showQuickView && (
        <QuickViewModal 
          product={{...product, image: `https://images.unsplash.com/photo-1631214499505-87bd3be5e7e6?auto=format&fit=crop&q=80&w=800`}} 
          onClose={(e) => {
            if (e) e.stopPropagation();
            setShowQuickView(false);
          }} 
        />
      )}
    </div>
  );
}

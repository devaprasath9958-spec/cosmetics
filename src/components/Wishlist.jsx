import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag, Check, Sparkles, HelpCircle } from "lucide-react";
import BottleIllustration from "./ui/BottleIllustration.jsx";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [addedItems, setAddedItems] = useState({}); // maps item.id to boolean indicating success state

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem("lume-wishlist");
        if (stored) {
          setWishlistItems(JSON.parse(stored));
        } else {
          setWishlistItems([]);
        }
      } catch (e) {
        setWishlistItems([]);
      }
    };
    loadWishlist();
    window.addEventListener("wishlist-updated", loadWishlist);
    window.addEventListener("storage", loadWishlist);
    return () => {
      window.removeEventListener("wishlist-updated", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
    };
  }, []);

  // Remove item from wishlist
  const handleRemove = (id) => {
    try {
      const stored = localStorage.getItem("lume-wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((item) => item.id !== id);
        localStorage.setItem("lume-wishlist", JSON.stringify(filtered));
        window.dispatchEvent(new Event("wishlist-updated"));
      }
    } catch (e) {
      console.error("Failed to remove item from wishlist:", e);
    }
  };

  // Add item to Cart
  const handleAddToCart = (item) => {
    try {
      const stored = localStorage.getItem("lume-cart");
      let cart = stored ? JSON.parse(stored) : [];
      
      const existingIdx = cart.findIndex(
        (cItem) => cItem.id === item.id && cItem.selectedShadeIndex === 0
      );
      
      if (existingIdx > -1) {
        cart[existingIdx].qty += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          subtitle: item.subtitle,
          price: item.price,
          qty: 1,
          bottle: item.bottle || "bottle",
          colors: item.colors || ["#C9A769", "#8B3A4B"],
          selectedShadeIndex: 0
        });
      }
      
      localStorage.setItem("lume-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));

      // Set button success state temporarily
      setAddedItems((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [item.id]: false }));
      }, 2000);
    } catch (e) {
      console.error("Failed to add wishlist item to cart:", e);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold font-medium">Wishlist</span>
        </div>
        <span className="text-[10px] text-smoke italic">Your Vanity Vault</span>
      </div>

      {/* Page Header */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/40 p-8 md:p-10">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-radial-fade blur-3xl opacity-60" />
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-rose">
            <Heart size={14} className="fill-rose text-rose animate-pulse" />
            <span>Saved Formulations</span>
          </div>
          <h1 className="font-display text-3xl font-normal italic tracking-wide text-ivory sm:text-4xl">
            Your Wishlist
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-smoke">
            Keep track of your favorite beauty rituals, customized swatches, and clean skincare essentials. Add them to your shopping bag whenever you are ready.
          </p>
        </div>
      </div>

      {/* Main Grid List */}
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-card"
            >
              {/* Product Visual */}
              <div className="relative mb-5 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-obsidian-soft">
                <div className="absolute h-32 w-32 rounded-full bg-radial-fade blur-2xl opacity-60" />
                <BottleIllustration
                  variant={item.bottle || "bottle"}
                  from={item.colors ? item.colors[0] : "#C9A769"}
                  to={item.colors ? (item.colors[1] || item.colors[0]) : "#8B3A4B"}
                  className="relative z-10 h-36 w-auto drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Quick Remove Button (Top Right) */}
                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/70 backdrop-blur text-smoke hover:text-rose hover:bg-obsidian transition-colors"
                >
                  <Trash2 size={14} />
                </button>

                {item.badge && (
                  <span className="absolute left-3 top-3 rounded-full border border-gold/30 bg-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 space-y-1">
                <Link
                  to={`/product/${item.id}`}
                  className="font-display text-lg text-ivory hover:text-gold transition-colors block font-medium"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-smoke italic font-display">{item.subtitle}</p>
                {item.category && (
                  <span className="inline-block text-[9px] uppercase tracking-wider text-gold font-semibold bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Pricing & CTA */}
              <div className="mt-6 flex items-center justify-between border-t border-obsidian-border/50 pt-4">
                <span className="font-display text-xl text-gold font-medium">${item.price}</span>

                <button
                  onClick={() => handleAddToCart(item)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    addedItems[item.id]
                      ? "bg-rose-deep text-rose border border-rose/30"
                      : "bg-gold text-obsidian hover:bg-gold-light"
                  }`}
                  aria-label={`Add ${item.name} to bag`}
                >
                  {addedItems[item.id] ? (
                    <>
                      <Check size={13} strokeWidth={2.5} />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={13} />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-obsidian-border bg-obsidian-light/20 py-24 text-center animate-fade-up">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-obsidian-soft border border-obsidian-border text-rose/60 mb-4 shadow-inner">
            <Heart size={24} className="text-smoke" />
          </div>
          <h3 className="font-display text-xl text-ivory">Your wishlist is empty</h3>
          <p className="mt-2 text-sm text-smoke max-w-xs">
            Save items to your vanity vault to monitor availability and keep track of your skincare formulations.
          </p>
          <Link
            to="/collections"
            className="mt-6 rounded-full bg-gold px-6 py-2.5 text-xs font-semibold text-obsidian transition-colors hover:bg-gold-light"
          >
            Explore Formulations
          </Link>
        </div>
      )}

    </div>
  );
}

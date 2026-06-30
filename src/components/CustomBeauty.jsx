import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Gift, Heart, Package, Palette, ShoppingBag, Sparkles } from "lucide-react";
import BottleIllustration from "./ui/BottleIllustration.jsx";
import { fetchCart, updateCartItem, fetchWishlist, toggleWishlist } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const productTypes = {
  Lipstick: { basePrice: 34, bottle: "tube", category: "Makeup", subtitle: "Custom velvet lip color" },
  Foundation: { basePrice: 48, bottle: "bottle", category: "Makeup", subtitle: "Tailored complexion veil" },
  Perfume: { basePrice: 72, bottle: "bottle", category: "Fragrance", subtitle: "Personal signature scent" },
  Skincare: { basePrice: 58, bottle: "jar", category: "Skincare", subtitle: "Bespoke treatment cream" },
  Eyeshadow: { basePrice: 42, bottle: "jar", category: "Makeup", subtitle: "Pressed pigment compact" },
};

const shades = [
  { name: "Rose Quartz", color: "#D98C9B", price: 0 },
  { name: "Cafe Nude", color: "#B9866B", price: 2 },
  { name: "Golden Sand", color: "#C9A769", price: 3 },
  { name: "Berry Noir", color: "#8B3A4B", price: 4 },
  { name: "Champagne Glow", color: "#E8C98D", price: 5 },
];

const sizes = [
  { name: "Mini", label: "15 ml / travel", price: 0 },
  { name: "Classic", label: "30 ml / daily", price: 10 },
  { name: "Grand", label: "50 ml / extended", price: 22 },
];

const fragrances = [
  { name: "Unscented", price: 0 },
  { name: "Vanilla Orchid", price: 4 },
  { name: "Rose Musk", price: 5 },
  { name: "Citrus Bloom", price: 4 },
  { name: "Amber Oud", price: 7 },
];

const packagingStyles = [
  { name: "Minimal Glass", price: 0 },
  { name: "Gold Monogram", price: 8 },
  { name: "Refillable Luxe", price: 14 },
  { name: "Limited Rose Case", price: 16 },
];

const giftWrapping = [
  { name: "No Gift Wrap", price: 0 },
  { name: "Ivory Ribbon", price: 6 },
  { name: "Luxury Gift Box", price: 12 },
];

function currency(value) {
  return `$${value.toFixed(2)}`;
}

export default function CustomBeauty() {
  const [productType, setProductType] = useState("Lipstick");
  const [shade, setShade] = useState(shades[0]);
  const [size, setSize] = useState(sizes[1]);
  const [fragrance, setFragrance] = useState(fragrances[0]);
  const [packaging, setPackaging] = useState(packagingStyles[0]);
  const [wrap, setWrap] = useState(giftWrapping[0]);
  const [toast, setToast] = useState("");
  const { requireAuth } = useAuth();

  const productConfig = productTypes[productType];

  const estimatedPrice = useMemo(() => {
    return productConfig.basePrice + shade.price + size.price + fragrance.price + packaging.price + wrap.price;
  }, [fragrance.price, packaging.price, productConfig.basePrice, shade.price, size.price, wrap.price]);

  const summary = [
    ["Product Type", productType],
    ["Shade/Color", shade.name],
    ["Size", `${size.name} - ${size.label}`],
    ["Fragrance", fragrance.name],
    ["Packaging Style", packaging.name],
    ["Gift Wrapping", wrap.name],
  ];

  const customItem = {
    id: `custom-${productType.toLowerCase()}-${shade.name.toLowerCase().replace(/\s+/g, "-")}-${size.name.toLowerCase()}-${packaging.name.toLowerCase().replace(/\s+/g, "-")}-${wrap.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: `Custom ${productType}`,
    subtitle: `${shade.name} / ${size.name} / ${packaging.name}`,
    category: productConfig.category,
    price: estimatedPrice,
    qty: 1,
    bottle: productConfig.bottle,
    colors: [shade.color, "#C9A769"],
    selectedShadeIndex: 0,
    badge: "Custom",
    customOptions: {
      productType,
      shade: shade.name,
      size: size.name,
      fragrance: fragrance.name,
      packaging: packaging.name,
      giftWrapping: wrap.name,
    },
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handleAddToCart = async () => {
    if (!requireAuth("Please sign in to add items to your cart.")) return;
    try {
      const cart = await fetchCart();
      const existing = cart.find((item) => item.id === customItem.id && item.selectedShadeIndex === 0);
      const newQty = existing ? existing.quantity + 1 : 1;
      await updateCartItem(customItem, newQty);
      
      window.dispatchEvent(new Event("cart-updated"));
      showToast("Custom beauty product added to your bag.");
    } catch (error) {
      console.error("Failed to add custom product to cart:", error);
      showToast("Unable to update cart. Please try again.");
    }
  };

  const handleAddToWishlist = async () => {
    if (!requireAuth("Please sign in to save items to your wishlist.")) return;
    try {
      const wishlist = await fetchWishlist();
      const exists = wishlist.some((item) => item.id === customItem.id);

      if (!exists) {
        await toggleWishlist(customItem, true);
        window.dispatchEvent(new Event("wishlist-updated"));
        showToast("Custom beauty product saved to wishlist.");
      } else {
        showToast("This custom beauty product is already in your wishlist.");
      }
    } catch (error) {
      console.error("Failed to add custom product to wishlist:", error);
      showToast("Unable to update wishlist. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="transition-colors hover:text-gold">Home</Link>
          <span>/</span>
          <span className="font-medium text-gold">Custom Beauty</span>
        </div>
        <span className="hidden text-[10px] italic text-smoke sm:inline">Bespoke LUME Rituals</span>
      </div>

      <section className="mb-10 border-b border-obsidian-border pb-8">
        <div className="max-w-3xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-gold">
            <Sparkles size={15} />
            <span>Made for your ritual</span>
          </div>
          <h1 className="font-display text-4xl italic tracking-wide text-ivory sm:text-5xl">
            Custom Beauty
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-smoke">
            Build a personalized LUME formula with your preferred color, scent, size, packaging, and gifting finish.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/50 p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 font-display text-xl text-ivory">
              <Palette size={18} className="text-gold" />
              Customize Your Formula
            </h2>

            <div className="space-y-7">
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Product Type
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Object.keys(productTypes).map((type) => (
                    <button
                      key={type}
                      onClick={() => setProductType(type)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        productType === type
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-obsidian-border bg-obsidian/30 text-smoke hover:border-gold/30 hover:text-ivory"
                      }`}
                    >
                      <span className="block font-semibold">{type}</span>
                      <span className="mt-1 block text-[11px] text-smoke">{currency(productTypes[type].basePrice)} base</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Shade/Color
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {shades.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => setShade(option)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                        shade.name === option.name
                          ? "border-gold bg-gold/10"
                          : "border-obsidian-border bg-obsidian/30 hover:border-gold/30"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm text-ivory">
                        <span
                          className="h-7 w-7 rounded-full border border-ivory/20"
                          style={{ backgroundColor: option.color }}
                        />
                        {option.name}
                      </span>
                      <span className="text-xs text-smoke">+{currency(option.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SelectBlock label="Size" options={sizes} selected={size.name} onSelect={setSize} />
                <SelectBlock label="Fragrance" options={fragrances} selected={fragrance.name} onSelect={setFragrance} />
                <SelectBlock label="Packaging Style" options={packagingStyles} selected={packaging.name} onSelect={setPackaging} />
                <SelectBlock label="Gift Wrapping" options={giftWrapping} selected={wrap.name} onSelect={setWrap} />
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-obsidian-border bg-obsidian-light/60">
              <div className="relative flex h-80 items-center justify-center bg-obsidian-soft p-8">
                <div className="absolute h-52 w-52 rounded-full bg-radial-fade blur-3xl" />
                <BottleIllustration
                  variant={productConfig.bottle}
                  from={shade.color}
                  to="#C9A769"
                  className="relative z-10 h-56 w-auto drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                  Live Preview
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">{productConfig.category}</p>
                <h2 className="mt-2 font-display text-2xl text-ivory">Custom {productType}</h2>
                <p className="mt-1 text-sm italic text-smoke">{productConfig.subtitle}</p>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-xs uppercase tracking-widest text-smoke">Estimated Price</span>
                  <span className="font-display text-3xl text-gold">{currency(estimatedPrice)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg text-ivory">
                <Package size={17} className="text-gold" />
                Order Summary
              </h2>
              <div className="space-y-3 border-b border-obsidian-border pb-5">
                {summary.map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-smoke">{label}</span>
                    <span className="text-right font-medium text-ivory">{value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-b border-obsidian-border py-5 text-sm text-smoke">
                <PriceLine label={`${productType} base`} value={productConfig.basePrice} />
                <PriceLine label={shade.name} value={shade.price} />
                <PriceLine label={size.name} value={size.price} />
                <PriceLine label={fragrance.name} value={fragrance.price} />
                <PriceLine label={packaging.name} value={packaging.price} />
                <PriceLine label={wrap.name} value={wrap.price} />
              </div>

              <div className="flex items-center justify-between py-5 font-display text-lg text-ivory">
                <span>Total</span>
                <span className="text-gold">{currency(estimatedPrice)}</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-obsidian shadow-glow transition-colors hover:bg-gold-light"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center gap-2 rounded-full border border-obsidian-border bg-obsidian/30 px-5 py-3 text-sm font-semibold text-ivory transition-colors hover:border-rose/40 hover:text-rose"
                >
                  <Heart size={16} />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-full border border-gold/30 bg-obsidian px-5 py-3 text-sm text-ivory shadow-card">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-obsidian">
            <Check size={16} />
          </span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function SelectBlock({ label, options, selected, onSelect }) {
  return (
    <div>
      <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.name}
            onClick={() => onSelect(option)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
              selected === option.name
                ? "border-gold bg-gold/10 text-ivory"
                : "border-obsidian-border bg-obsidian/30 text-smoke hover:border-gold/30 hover:text-ivory"
            }`}
          >
            <span>
              <span className="block font-medium">{option.name}</span>
              {option.label && <span className="mt-0.5 block text-[11px] text-smoke">{option.label}</span>}
            </span>
            <span className="text-xs text-smoke">+{currency(option.price)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PriceLine({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-ivory">{value === 0 ? "Included" : currency(value)}</span>
    </div>
  );
}

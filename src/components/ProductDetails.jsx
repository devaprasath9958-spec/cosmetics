import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star, ArrowLeft, Plus, Minus, Check, ChevronDown, Sparkles } from "lucide-react";
import { products } from "../data/products.js";
import BottleIllustration from "./ui/BottleIllustration.jsx";
import ProductCard from "./ui/ProductCard.jsx";
import StarRating from "./ui/StarRating.jsx";
import RelatedProducts from "./RelatedProducts.jsx";

// Extended product information mapping to keep data files clean and supply rich details.
const PRODUCT_INFO_EXTENSIONS = {
  p1: {
    description: "An intensely hydrating elixir powered by multi-weight hyaluronic acid and high-purity Vitamin C. This micro-fluidic serum instantly plumps skin, fading fine lines while infusing cells with deep antioxidant protection for an enduring glass-like dewy finish.",
    benefits: [
      "Binds moisture up to 1000x its weight for deep dermal hydration.",
      "Stabilized Vitamin C boosts natural collagen synthesis by 32%.",
      "Combats free-radical stress and pollution-induced dullness.",
      "Ultra-lightweight fluid absorbs in under 10 seconds."
    ],
    usage: "After cleansing and toning, press 3–4 drops onto face and neck. Gently pat with your palms to enhance absorption. Follow with a nourishing moisturizer. Suitable for both morning and evening rituals.",
    ingredients: "Water, Sodium Hyaluronate (Multi-weight), Ascorbic Acid (Vitamin C), Niacinamide (5%), Glycerin, Panthenol, Camellia Sinensis (Green Tea) Leaf Extract, Centella Asiatica Extract, Phenoxyethanol, Ethylhexylglycerin."
  },
  p2: {
    description: "A weightless, ultra-saturated lipstick that delivers rich color payoff with a luxurious, velvety-soft matte finish. Infused with organic argan oil and hyaluronic filling spheres, it cushions lips in comfort, ensuring all-day wear without dehydration or feathering.",
    benefits: [
      "12-hour high-pigment retention with a transfer-resistant seal.",
      "Velvet-smooth texture that hides fine lip lines.",
      "Enriched with argan oil and botanical lipids for continuous hydration.",
      "Glides on effortlessly with a light, second-skin feel."
    ],
    usage: "Swipe directly onto clean lips. For maximum definition and precision, outline contours using a matching lip liner starting from the cupid's bow and working outwards.",
    ingredients: "Dimethicone, Octyldodecanol, Silica, Kaolin, Argania Spinosa (Argan) Kernel Oil, Sodium Hyaluronate, Hydrogenated Castor Oil, Candelilla Wax, Tocopheryl Acetate, Iron Oxides (CI 77491, CI 77492), Red 7 Lake."
  },
  p3: {
    description: "A transformative toner that refines skin texture and minimizes the appearance of pores. Combining the brightening properties of Niacinamide with the traditional skin-softening benefits of fermented rice water, it preps your canvas for optimal absorption of subsequent treatments.",
    benefits: [
      "Refines uneven skin texture and tightens enlarged pores.",
      "Fermented rice water brightens and restores skin's natural pH level.",
      "Contains 3% Niacinamide to fade hyperpigmentation.",
      "Alcohol-free formula hydrates without stripping skin."
    ],
    usage: "Dispense onto a premium cotton pad or directly into clean hands. Press gently into the face and neck until fully absorbed. Use morning and night after cleansing.",
    ingredients: "Saccharomyces/Rice Ferment Filtrate, Water, Niacinamide, Butylene Glycol, 1,2-Hexanediol, Glycerin, Allantoin, Adenosine, Sodium Hyaluronate, Licorice Root Extract, Carbomer."
  },
  p4: {
    description: "An evocative, complex fragrance that captures the essence of midnight blooms under starlight. Opening with crisp botanical notes and settling into warm woods and rare florals, this Eau de Parfum is an olfactory statement of mystery and understated luxury.",
    benefits: [
      "Long-lasting scent projection (8+ hours wear time).",
      "Features top notes of Blackcurrant, heart of Midnight Rose, base of Amber & Oud.",
      "Blended with pure botanical essential oils.",
      "Sourced sustainably and cruelty-free."
    ],
    usage: "Mist onto pulse points — wrists, inner elbows, and base of the neck. Avoid rubbing the fragrance, as this breaks down the delicate top notes and alters the scent progression.",
    ingredients: "Alcohol Denat., Fragrance (Parfum), Water (Aqua), Benzyl Salicylate, Limonene, Linalool, Coumarin, Citronellol, Geraniol, Citral."
  },
  p5: {
    description: "A breathable, high-performance foundation that unifies the complexion with a silk-like veil. The buildable formula provides light-to-medium coverage with a natural finish, resisting creasing, sweat, and transfer for a flawless 24-hour presentation.",
    benefits: [
      "Ultra-breathable micro-silk formula adapts to skin's texture.",
      "Satin, buildable coverage with a luminous, soft-focus finish.",
      "Humidity-resistant, transfer-proof, and crease-resistant for 24h.",
      "Infused with SPF 15 and vitamin E for environmental defense."
    ],
    usage: "Dispense one pump and apply to the center of the face, blending outwards using a damp beauty sponge or foundation brush. Build coverage in thin layers as desired.",
    ingredients: "Water, Cyclopentasiloxane, Titanium Dioxide, Dimethicone, Ethylhexyl Methoxycinnamate, Glycerin, Cetyl PEG/PPG-10/1 Dimethicone, Tocopheryl Acetate (Vitamin E), Silica, Magnesium Sulfate."
  },
  p6: {
    description: "A pillowy, gel-cream blush that melts into skin for a natural, flushed-from-within glow. The hybrid formula is exceptionally easy to build and blend, delivering a long-lasting wash of dew-kissed color without feeling greasy or heavy.",
    benefits: [
      "Pillowy gel-cream texture blends seamlessly without streaks.",
      "Delivers a dewy, youthful flush that lasts all day.",
      "Formulated with collagen and botanical oils to plump cheeks.",
      "Highly buildable formula allows for sheer to intense coverage."
    ],
    usage: "Dab 1–2 dots onto the apples of the cheeks. Blend upwards and outwards using fingers, a blush brush, or a damp sponge for a seamless wash of color.",
    ingredients: "Water, Cyclopentasiloxane, Methyl Trimethicone, Mica, Butylene Glycol, PEG-10 Dimethicone, Dicaprylyl Carbonate, Disteardimonium Hectorite, Rose Extract, Phenoxyethanol."
  },
  p7: {
    description: "An intensive overnight hair treatment designed to rescue dry, damaged, and chemically processed strands. Formulated with hydrolyzed silk proteins and nourishing abyssinian oil, it deeply penetrates the cuticle to restore elasticity, shine, and structural integrity.",
    benefits: [
      "Repairs split ends and cuticular damage while you sleep.",
      "Hydrolyzed silk restores hair elasticity and tensile strength.",
      "Protects against thermal styling and environmental stress.",
      "Leaves hair exceptionally smooth, shiny, and tangle-free."
    ],
    usage: "Apply a generous amount to clean, damp or dry hair from mid-lengths to ends. Leave on overnight. No rinsing required. Style as usual in the morning. Use 2-3 times weekly.",
    ingredients: "Water, Cetearyl Alcohol, Behentrimonium Chloride, Crambe Abyssinica Seed Oil, Hydrolyzed Silk, Panthenol, Keratin Amino Acids, Dimethiconol, Fragrance, Benzyl Alcohol."
  },
  p8: {
    description: "A superfine pressed luminizer containing genuine rose quartz micro-crystals. This buttery, light-reflective highlighter sweeps across the skin like a warm beam of light, delivering a wet-look radiance that flatters all skin tones.",
    benefits: [
      "Infused with real rose quartz powder for high-vibrancy sheen.",
      "Buttery, cream-to-powder texture that never looks chalky.",
      "Zero chunky glitter; delivers a pure, wet-look reflection.",
      "Reflects light dynamically to accentuate bone structure."
    ],
    usage: "Using a fan brush or fingertips, sweep along the high points of the face — cheekbones, brow bones, bridge of the nose, and the cupid's bow.",
    ingredients: "Mica, Talc, Caprylic/Capric Triglyceride, Rose Quartz Powder, Zinc Stearate, Dimethicone, Silica, Phenoxyethanol, Ethylhexylglycerin, Titanium Dioxide (CI 77891)."
  }
};

const DEFAULT_EXTENSION = {
  description: "A premium formulated cosmetic ritual crafted to elevate your daily routine. Blended with skin-loving botanical ingredients and designed to offer long-lasting comfort, beauty, and radiant vitality.",
  benefits: [
    "Formulated with high-purity, dermatologist-tested ingredients.",
    "Brings nourishment and long-wearing resilience to your beauty regimen.",
    "Eco-conscious, cruelty-free, and vegan formulation.",
    "Designed to blend seamlessly with all skin tones and types."
  ],
  usage: "Incorporate into your daily ritual. Apply a small amount to clean skin or hair, blending gently until absorbed, or swipe on as desired.",
  ingredients: "Water, Glycerin, Caprylic/Capric Triglyceride, Butylene Glycol, Pentylene Glycol, Phenoxyethanol, Ethylhexylglycerin, Tocopheryl Acetate, Xanthan Gum."
};

const MOCK_REVIEWS_DATABASE = {
  p1: [
    { name: "Sophia Reynolds", rating: 5, date: "2 weeks ago", comment: "My dry patches are completely gone! My face looks like glass after applying this. I've bought 3 bottles already." },
    { name: "Marcus Thorne", rating: 4, date: "1 month ago", comment: "Excellent hydration. It is slightly tacky on application but sinks in within a minute. Skin feels incredibly plump." },
  ],
  p2: [
    { name: "Elena Rostova", rating: 5, date: "3 days ago", comment: "Café Nude is the absolute perfect nude shade. It is so hard to find a matte that does not turn dry and flaky. This feels like velvet!" },
    { name: "Jessica Kim", rating: 4, date: "3 weeks ago", comment: "Beautiful shade range and high pigment. Lasts through my morning coffee easily. Docked 1 star because it transfers slightly." },
  ],
  p3: [
    { name: "Aria Vance", rating: 5, date: "1 month ago", comment: "This has done wonders for my texture. My pores on my nose look significantly smaller, and my skin tone looks so even." },
    { name: "Devon Miller", rating: 5, date: "2 months ago", comment: "Lightweight, calming, and smells subtly like sweet rice water. Perfect for my sensitive skin." }
  ],
  p4: [
    { name: "Isabella Martinez", rating: 5, date: "1 week ago", comment: "This is the most hypnotic fragrance I have ever owned. I get compliments literally every time I step out of the house. Extremely long-lasting." },
    { name: "Nathan Patel", rating: 4, date: "1 month ago", comment: "Very unique woody floral. Strong amber notes. A bit heavy for summer days, but a stunning signature scent for evenings." }
  ]
};

const DEFAULT_REVIEWS = [
  { name: "Amara Nair", rating: 5, date: "3 weeks ago", comment: "LUMÉ has completely elevated my vanity. This product performs exactly as advertised. Beautiful packaging and textures!" },
  { name: "Jordan Brooks", rating: 5, date: "2 months ago", comment: "A solid formulation that is gentle on my sensitive skin. Highly recommend for any daily skincare or makeup ritual." }
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => {
    return products.find((p) => p.id === id) || products[0];
  }, [id]);

  const [activeTab, setActiveTab] = useState("description"); // "description", "apply", "ingredients"
  const [activeGalleryView, setActiveGalleryView] = useState("bottle"); // "bottle", "swatch", "box"
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const checkSaved = () => {
      try {
        const stored = localStorage.getItem("lume-wishlist");
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlisted(parsed.some((item) => item.id === product.id));
        } else {
          setWishlisted(false);
        }
      } catch (e) {
        setWishlisted(false);
      }
    };
    checkSaved();
    window.addEventListener("wishlist-updated", checkSaved);
    window.addEventListener("storage", checkSaved);
    return () => {
      window.removeEventListener("wishlist-updated", checkSaved);
      window.removeEventListener("storage", checkSaved);
    };
  }, [product.id]);

  const handleToggleWishlist = () => {
    try {
      const stored = localStorage.getItem("lume-wishlist");
      let list = stored ? JSON.parse(stored) : [];
      const exists = list.some((item) => item.id === product.id);
      
      if (exists) {
        list = list.filter((item) => item.id !== product.id);
      } else {
        list.push(product);
      }
      
      localStorage.setItem("lume-wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Color selection (Shade selector)
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);

  // Reset states on product change
  useEffect(() => {
    setSelectedShadeIndex(0);
    setQuantity(1);
    setActiveGalleryView("bottle");
    setAddedSuccess(false);
    setIsAdding(false);
  }, [id]);

  const activeColors = useMemo(() => {
    // If the product has colors, use the selected one as main and the other as secondary
    if (!product.colors || product.colors.length === 0) {
      return ["#C9A769", "#8B3A4B"];
    }
    if (product.colors.length === 1) {
      return [product.colors[0], product.colors[0]];
    }
    // Set active colors based on selected shade swatch
    const selectedColor = product.colors[selectedShadeIndex];
    const otherColor = product.colors[1 - selectedShadeIndex] || product.colors[0];
    return [selectedColor, otherColor];
  }, [product, selectedShadeIndex]);

  // Get rich text metadata for active product
  const extension = useMemo(() => {
    return PRODUCT_INFO_EXTENSIONS[product.id] || DEFAULT_EXTENSION;
  }, [product]);

  // Get related products from the same category
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product]);

  // Get reviews
  const productReviews = useMemo(() => {
    return MOCK_REVIEWS_DATABASE[product.id] || DEFAULT_REVIEWS;
  }, [product]);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    setTimeout(() => {
      try {
        const stored = localStorage.getItem("lume-cart");
        let cart = [];
        if (stored) {
          cart = JSON.parse(stored);
        }
        
        const existingItemIdx = cart.findIndex(
          (item) => item.id === product.id && item.selectedShadeIndex === selectedShadeIndex
        );
        
        if (existingItemIdx > -1) {
          cart[existingItemIdx].qty += quantity;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            qty: quantity,
            bottle: product.bottle || "bottle",
            colors: product.colors || ["#C9A769", "#8B3A4B"],
            selectedShadeIndex: selectedShadeIndex
          });
        }
        
        localStorage.setItem("lume-cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cart-updated"));
      } catch (e) {
        console.error("Failed to add to cart:", e);
      }
      
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }, 1200);
  };

  const formattedCategoryLabel = (cat) => {
    if (cat === "Hair Care") return "Haircare";
    if (cat === "Fragrance") return "Fragrances";
    return cat;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      
      {/* Breadcrumbs & Back Nav */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-smoke hover:text-gold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest text-smoke/70">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-gold">Collections</Link>
          <span>/</span>
          <Link to={`/collections?category=${product.category}`} className="hover:text-gold">
            {formattedCategoryLabel(product.category)}
          </Link>
          <span>/</span>
          <span className="text-gold font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Grid: Details & Gallery */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 mb-20">
        
        {/* Left Column: Interactive Visual Gallery (5 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/60 p-8">
            <div className="absolute inset-0 bg-radial-fade blur-3xl opacity-40 -z-10" />
            
            {activeGalleryView === "bottle" && (
              <div className="relative flex h-full w-full items-center justify-center animate-fade-up">
                <BottleIllustration
                  variant={product.bottle}
                  from={activeColors[0]}
                  to={activeColors[1]}
                  className="h-80 w-auto drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            {activeGalleryView === "swatch" && (
              <div className="flex h-full w-full items-center justify-center p-8 animate-fade-up">
                {/* Visual rendering of a luxury smudged gloss/liquid swatch */}
                <div className="relative h-64 w-64 overflow-hidden rounded-full border border-obsidian-border bg-obsidian-soft shadow-inner flex items-center justify-center">
                  <div
                    className="absolute h-40 w-40 rounded-full blur-xl opacity-80 animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${activeColors[0]} 0%, ${activeColors[1]} 100%)`
                    }}
                  />
                  <div
                    className="h-32 w-48 rounded-full transform -rotate-12 opacity-80"
                    style={{
                      background: `linear-gradient(135deg, ${activeColors[0]} 10%, transparent 60%, ${activeColors[1]} 90%)`,
                      boxShadow: `0 0 40px ${activeColors[0]}40, inset 0 0 20px rgba(255,255,255,0.2)`
                    }}
                  />
                  <div className="absolute text-center z-10">
                    <span className="font-display text-xs italic tracking-widest text-ivory/80 uppercase">Formula Swatch</span>
                    <div className="mt-1.5 flex justify-center gap-1">
                      <span className="h-1 w-8 rounded-full" style={{ backgroundColor: activeColors[0] }} />
                      <span className="h-1 w-4 rounded-full" style={{ backgroundColor: activeColors[1] }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeGalleryView === "box" && (
              <div className="flex h-full w-full items-center justify-center animate-fade-up">
                {/* Renders packaging box outline */}
                <div className="relative flex flex-col items-center justify-center border border-dashed border-gold/30 rounded-2xl p-10 h-72 w-56 bg-obsidian-soft/50 shadow-glow">
                  <div className="w-16 h-40 border border-gold/40 rounded-lg flex flex-col justify-between p-3 opacity-90">
                    <div className="flex justify-center"><Sparkles size={12} className="text-gold" /></div>
                    <div className="h-1.5 w-full bg-gold/20 rounded-full" />
                    <div className="text-[7px] text-center font-display text-gold italic">LUMÉ</div>
                  </div>
                  <div className="mt-4 text-center">
                    <h4 className="text-xs font-semibold uppercase tracking-widest2 text-gold">Eco-Luxury Carton</h4>
                    <p className="text-[10px] text-smoke mt-1 leading-relaxed">100% recyclable post-consumer fiber paper.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Badges */}
            {product.badge && (
              <span className="absolute left-6 top-6 rounded-full border border-gold/30 bg-gold/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Selectors */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "bottle", label: "Ritual Bottle" },
              { id: "swatch", label: "Texture Swatch" },
              { id: "box", label: "Eco Packaging" }
            ].map((tab) => {
              const isSelected = activeGalleryView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveGalleryView(tab.id)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    isSelected
                      ? "border-gold bg-obsidian-soft"
                      : "border-obsidian-border bg-obsidian-light/40 hover:border-gold/30"
                  }`}
                >
                  <span className={`text-xs font-medium ${isSelected ? "text-gold" : "text-smoke"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Info & Purchases (7 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest2 text-gold">
                {formattedCategoryLabel(product.category)}
              </span>
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-xs text-smoke">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Header info */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-ivory font-normal leading-tight">
                {product.name}
              </h1>
              <p className="mt-1 text-base text-smoke italic font-display">{product.subtitle}</p>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-gold">${product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-smoke line-through">${product.oldPrice}</span>
                  <span className="text-xs font-bold text-rose uppercase tracking-wider bg-rose-deep/20 px-2 py-0.5 rounded border border-rose/30">
                    Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Micro-description */}
            <p className="text-sm leading-relaxed text-smoke/90">
              {extension.description}
            </p>

            {/* Shade Selection swatches (if colors exist) */}
            {product.colors && product.colors.length > 0 && (
              <div className="border-t border-obsidian-border pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">
                  Select Shade: <span className="text-ivory lowercase font-normal italic">shade {selectedShadeIndex + 1}</span>
                </h3>
                <div className="flex items-center gap-3">
                  {product.colors.map((color, idx) => {
                    const isSelected = selectedShadeIndex === idx;
                    return (
                      <button
                        key={color + idx}
                        onClick={() => setSelectedShadeIndex(idx)}
                        aria-label={`Select shade ${idx + 1}`}
                        className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? "border-gold scale-105"
                            : "border-obsidian-border hover:border-gold/30 hover:scale-105"
                        }`}
                        style={{ outline: "none" }}
                      >
                        <span
                          className="h-7 w-7 rounded-full transition-transform duration-300 group-hover:scale-95"
                          style={{ backgroundColor: color }}
                        />
                        {isSelected && (
                          <span className="absolute z-10 text-obsidian bg-ivory rounded-full p-0.5 shadow-md">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cart Controllers */}
            <div className="border-t border-obsidian-border pt-6 space-y-4">
              <div className="flex items-center gap-4">
                
                {/* Quantity */}
                <div className="flex items-center rounded-full border border-obsidian-border bg-obsidian/30 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-smoke transition-colors hover:text-ivory disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-10 text-center font-display text-sm text-ivory">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-smoke transition-colors hover:text-ivory"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={handleToggleWishlist}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                    wishlisted
                      ? "border-rose bg-rose-deep/10 text-rose"
                      : "border-obsidian-border bg-obsidian-light/40 text-smoke hover:border-gold/30 hover:text-gold"
                  }`}
                >
                  <Heart size={16} className={wishlisted ? "fill-rose" : ""} />
                </button>
              </div>

              {/* Add to bag button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`group relative flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold transition-all duration-300 shadow-glow ${
                  addedSuccess
                    ? "bg-rose-deep text-rose border border-rose/30"
                    : "bg-gold text-obsidian hover:bg-gold-light"
                }`}
              >
                {isAdding ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-obsidian border-t-transparent" />
                ) : addedSuccess ? (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add {quantity} to Bag — ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-obsidian-border pt-6 space-y-3">
              {[
                { id: "description", label: "Details & Benefits", content: (
                  <ul className="space-y-2 list-disc pl-4 text-smoke text-sm">
                    {extension.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )},
                { id: "apply", label: "How to Apply", content: (
                  <p className="text-sm leading-relaxed text-smoke">{extension.usage}</p>
                )},
                { id: "ingredients", label: "Ingredients", content: (
                  <p className="text-sm leading-relaxed text-smoke italic font-mono text-[11px] tracking-wide bg-obsidian/20 p-4 rounded-xl border border-obsidian-border">
                    {extension.ingredients}
                  </p>
                )}
              ].map((accordion) => {
                const isOpen = activeTab === accordion.id;
                return (
                  <div key={accordion.id} className="border-b border-obsidian-border/50 pb-3">
                    <button
                      onClick={() => setActiveTab(isOpen ? "" : accordion.id)}
                      className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-ivory hover:text-gold transition-colors"
                    >
                      <span>{accordion.label}</span>
                      <ChevronDown
                        size={16}
                        className={`text-smoke transition-transform duration-300 ${isOpen ? "rotate-180 text-gold" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 animate-fade-up">
                        {accordion.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Related Products ("Complete the Ritual") */}
      {relatedProducts.length > 0 && (
        <RelatedProducts />
      )}

      {/* Reviews list */}
      <div className="border-t border-obsidian-border pt-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Rating Summary Grid Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-display text-2xl text-ivory">Customer Reviews</h2>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl text-gold">{product.rating}</span>
              <span className="text-sm text-smoke">out of 5</span>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-smoke">Based on {product.reviews} reviews</span>
            </div>

            {/* Ratings distribution bars */}
            <div className="space-y-2 pt-2">
              {[
                { stars: 5, pct: "78%" },
                { stars: 4, pct: "16%" },
                { stars: 3, pct: "4%" },
                { stars: 2, pct: "2%" },
                { stars: 1, pct: "0%" }
              ].map((bar) => (
                <div key={bar.stars} className="flex items-center gap-3 text-xs text-smoke">
                  <span className="w-12 text-right">{bar.stars} stars</span>
                  <div className="h-1.5 flex-1 rounded-full bg-obsidian-soft border border-obsidian-border overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: bar.pct }} />
                  </div>
                  <span className="w-8 text-left">{bar.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial List Grid Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {productReviews.map((review, i) => (
              <div
                key={i}
                className="rounded-2xl border border-obsidian-border bg-obsidian-light/40 p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-ivory">{review.name}</h4>
                    <span className="text-[10px] text-smoke">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm leading-relaxed text-smoke/90">{review.comment}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

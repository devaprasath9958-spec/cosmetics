import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown, Sparkles, HelpCircle } from "lucide-react";
import { products } from "../data/products.js";
import ProductCard from "./ui/ProductCard.jsx";

const FEATURED_COLLECTIONS = [
  {
    id: "glow-ritual",
    name: "Glow Ritual",
    description: "Deep hydration and glass-skin radiance.",
    categories: ["Skincare"],
    badges: [],
    priceRange: [30, 100],
    accent: "from-gold/30 to-rose/10",
  },
  {
    id: "midnight-majesty",
    name: "Midnight Majesty",
    description: "Seductive fragrances and velvet lips.",
    categories: ["Fragrance", "Makeup"],
    badges: ["Limited", "Bestseller"],
    priceRange: [0, 150],
    accent: "from-rose-deep/30 to-obsidian-soft",
  },
  {
    id: "satin-restoration",
    name: "Satin Restoration",
    description: "Overnight therapy and flawless bases.",
    categories: ["Hair Care", "Makeup"],
    badges: ["Sale", "New"],
    priceRange: [0, 100],
    accent: "from-gold-dark/20 to-smoke/10",
  },
  {
    id: "rose-quartz",
    name: "Quartz Radiance",
    description: "Luminous cheeks and highlights.",
    categories: ["Makeup"],
    badges: ["New", "Bestseller"],
    priceRange: [0, 50],
    accent: "from-rose/30 to-gold/10",
  },
];

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search") ?? "";

  const updateSearchParam = (query) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const trimmed = query.trim();
        if (trimmed) {
          next.set("search", trimmed);
        } else {
          next.delete("search");
        }
        return next;
      },
      { replace: true }
    );
  };

  const updateCategoryParam = (category) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category === "All") {
        next.delete("category");
      } else {
        next.set("category", category);
      }
      return next;
    });
  };

  // State Management
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [priceFilter, setPriceFilter] = useState("All"); // "All", "under-30", "30-60", "over-60"
  const [sortBy, setSortBy] = useState("default"); // "default", "price-asc", "price-desc", "rating"
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Synchronize category from URL search params
  useEffect(() => {
    if (categoryParam) {
      // Map URL parameters (like "Hair Care" or "Haircare")
      const formatted = categoryParam === "Haircare" ? "Hair Care" : categoryParam;
      setSelectedCategory(formatted);
      setSelectedCollection(null); // Clear collection filter if category clicked
    } else {
      setSelectedCategory("All");
    }
  }, [categoryParam]);

  // Handle Featured Collection click
  const handleCollectionClick = (collection) => {
    if (selectedCollection?.id === collection.id) {
      // Clear
      setSelectedCollection(null);
      setSelectedCategory("All");
      setSelectedBadges([]);
      setPriceFilter("All");
    } else {
      setSelectedCollection(collection);
      // Apply collection filters
      if (collection.categories.length === 1) {
        setSelectedCategory(collection.categories[0]);
      } else {
        setSelectedCategory("All"); // Multiple categories will be handled in filter logic
      }
      setSelectedBadges(collection.badges);
      setPriceFilter("All"); // Custom range will be evaluated in the hook
      // Clear query params when a collection is selected to avoid conflicts
      setSearchParams({});
    }
  };

  // Toggle badged status filter
  const toggleBadgeFilter = (badge) => {
    setSelectedCollection(null); // Clear selected collection if manual filter changed
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedBadges([]);
    setPriceFilter("All");
    setSortBy("default");
    setSelectedCollection(null);
    setSearchParams({});
  };

  // Filter and Sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search Query Filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchSubtitle = product.subtitle.toLowerCase().includes(query);
          const matchCategory = product.category.toLowerCase().includes(query);
          if (!matchName && !matchSubtitle && !matchCategory) return false;
        }

        // Category Filter
        if (selectedCollection) {
          // If a collection is selected, match its list of categories
          if (selectedCollection.categories.length > 0) {
            const hasCategory = selectedCollection.categories.includes(product.category);
            if (!hasCategory) return false;
          }
        } else if (selectedCategory !== "All") {
          // Normal category filter
          if (product.category !== selectedCategory) return false;
        }

        // Badge Filters
        if (selectedCollection && selectedCollection.badges.length > 0) {
          // If collection requires specific badges, match at least one
          const matchBadge = selectedCollection.badges.includes(product.badge);
          if (!matchBadge) return false;
        } else if (selectedBadges.length > 0) {
          // Normal badge checklist filter
          if (!product.badge || !selectedBadges.includes(product.badge)) return false;
        }

        // Price Filter
        if (selectedCollection) {
          const [min, max] = selectedCollection.priceRange;
          if (product.price < min || product.price > max) return false;
        } else if (priceFilter !== "All") {
          if (priceFilter === "under-30" && product.price >= 30) return false;
          if (priceFilter === "30-60" && (product.price < 30 || product.price > 60)) return false;
          if (priceFilter === "over-60" && product.price <= 60) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // Default sorting
      });
  }, [searchQuery, selectedCategory, selectedBadges, priceFilter, sortBy, selectedCollection]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (selectedBadges.length > 0) count += selectedBadges.length;
    if (priceFilter !== "All") count++;
    if (searchQuery) count++;
    if (selectedCollection) count++;
    return count;
  }, [selectedCategory, selectedBadges, priceFilter, searchQuery, selectedCollection]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Page Header */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/40 p-8 md:p-12">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-radial-fade blur-3xl opacity-60" />
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-gold">
            <Sparkles size={14} />
            <span>Formulated Radiance</span>
          </div>
          <h1 className="font-display text-4xl font-normal italic tracking-wide text-ivory sm:text-5xl">
            The Collections
          </h1>
          <p className="mt-4 text-base leading-relaxed text-smoke">
            Browse our meticulously curated cosmetic lines. From dermatological skincare essentials 
            to rich velveteens and botanical scents, find the perfect addition to your daily ritual.
          </p>
        </div>
      </div>

      {/* Featured Collections Section */}
      <div className="mb-14">
        <h2 className="mb-6 font-display text-2xl text-ivory">Featured Curations</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COLLECTIONS.map((col) => {
            const isSelected = selectedCollection?.id === col.id;
            return (
              <button
                key={col.id}
                onClick={() => handleCollectionClick(col)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                  isSelected
                    ? "border-gold bg-obsidian-soft"
                    : "border-obsidian-border bg-obsidian-light/60 hover:border-gold/30"
                }`}
              >
                <div
                  className={`absolute -right-8 -top-8 -z-10 h-28 w-28 rounded-full bg-gradient-to-br ${col.accent} blur-xl opacity-50 group-hover:scale-125 transition-transform duration-500`}
                />
                <div>
                  <h3 className="font-display text-lg font-medium text-ivory group-hover:text-gold transition-colors">
                    {col.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-smoke">{col.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-smoke/70">
                    {col.categories.join(" + ")}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? "text-gold" : "text-ivory/50 group-hover:text-ivory"
                    } transition-colors`}
                  >
                    {isSelected ? "Applied" : "Explore →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Content Layout */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        
        {/* DESKTOP FILTERS (Sidebar) */}
        <aside className="hidden lg:block space-y-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSelectedCollection(null);
                  updateSearchParam(e.target.value);
                }}
                className="w-full rounded-full border border-obsidian-border bg-obsidian/40 px-4 py-2.5 pl-10 text-sm text-ivory placeholder-smoke/60 outline-none transition-colors focus:border-gold/50"
              />
              <Search size={16} className="absolute left-3.5 top-3.5 text-smoke/70" />
              {searchQuery && (
                <button
                  onClick={() => updateSearchParam("")}
                  className="absolute right-3.5 top-3.5 text-smoke/70 hover:text-ivory"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">Categories</h3>
            <div className="space-y-2">
              {["All", "Skincare", "Makeup", "Hair Care", "Fragrance"].map((cat) => {
                const label = cat === "Hair Care" ? "Haircare" : cat === "Fragrance" ? "Fragrances" : cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCollection(null);
                      updateCategoryParam(cat);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-gold/10 text-gold font-medium"
                        : "text-smoke hover:bg-obsidian-light/50 hover:text-ivory"
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] text-smoke/50 bg-obsidian p-1 px-2 rounded-full">
                      {cat === "All"
                        ? products.length
                        : products.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">Price</h3>
            <div className="space-y-2.5">
              {[
                { label: "All Prices", value: "All" },
                { label: "Under $30", value: "under-30" },
                { label: "$30 to $60", value: "30-60" },
                { label: "Over $60", value: "over-60" },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setSelectedCollection(null);
                    setPriceFilter(range.value);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    priceFilter === range.value
                      ? "text-gold font-medium"
                      : "text-smoke hover:text-ivory"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      priceFilter === range.value ? "border-gold" : "border-obsidian-border"
                    }`}
                  >
                    {priceFilter === range.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    )}
                  </span>
                  <span>{range.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">Product Status</h3>
            <div className="space-y-2.5">
              {["Bestseller", "New", "Sale", "Limited"].map((badge) => {
                const isChecked = selectedBadges.includes(badge);
                return (
                  <button
                    key={badge}
                    onClick={() => toggleBadgeFilter(badge)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      isChecked ? "text-gold font-medium" : "text-smoke hover:text-ivory"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isChecked ? "border-gold bg-gold/10" : "border-obsidian-border"
                      }`}
                    >
                      {isChecked && <span className="h-1.5 w-1.5 rounded-sm bg-gold" />}
                    </span>
                    <span>{badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="lg:col-span-3">
          
          {/* Controls Bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-obsidian-border pb-6">
            
            {/* Left side: Results Count & Filter Pills */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-smoke">
                Showing <span className="text-ivory font-medium">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedCollection && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/5 px-2.5 py-0.5 text-xs text-gold">
                      Curation: {selectedCollection.name}
                      <button onClick={() => setSelectedCollection(null)} className="hover:text-ivory">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {!selectedCollection && selectedCategory !== "All" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-obsidian-border bg-obsidian-light/60 px-2.5 py-0.5 text-xs text-smoke">
                      Category: {selectedCategory === "Hair Care" ? "Haircare" : selectedCategory === "Fragrance" ? "Fragrances" : selectedCategory}
                      <button onClick={() => {
                        setSelectedCategory("All");
                        updateCategoryParam("All");
                      }} className="hover:text-ivory">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-obsidian-border bg-obsidian-light/60 px-2.5 py-0.5 text-xs text-smoke">
                      Query: "{searchQuery}"
                      <button onClick={() => updateSearchParam("")} className="hover:text-ivory">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {priceFilter !== "All" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-obsidian-border bg-obsidian-light/60 px-2.5 py-0.5 text-xs text-smoke">
                      Price: {priceFilter.replace("-", " to ")}
                      <button onClick={() => setPriceFilter("All")} className="hover:text-ivory">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1.5 rounded-full border border-obsidian-border bg-obsidian-light/60 px-2.5 py-0.5 text-xs text-smoke"
                    >
                      Status: {badge}
                      <button onClick={() => toggleBadgeFilter(badge)} className="hover:text-ivory">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-gold hover:text-gold-light"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Right side: Sorting dropdown & Mobile toggle */}
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-full border border-obsidian-border bg-obsidian-light/60 px-4 py-2 text-sm text-ivory hover:border-gold/30 lg:hidden"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-obsidian">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative flex items-center gap-2">
                <span className="text-xs text-smoke hidden sm:inline">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-full border border-obsidian-border bg-obsidian-light/60 py-2 pl-4 pr-10 text-sm text-ivory outline-none transition-colors hover:border-gold/30 focus:border-gold"
                >
                  <option value="default">Default / Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 pointer-events-none text-smoke" />
              </div>
            </div>

          </div>

          {/* Mobile Search - only visible on small viewports */}
          <div className="mb-6 lg:hidden relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSelectedCollection(null);
                updateSearchParam(e.target.value);
              }}
              className="w-full rounded-full border border-obsidian-border bg-obsidian-light/40 px-4 py-2.5 pl-10 text-sm text-ivory placeholder-smoke/60 outline-none"
            />
            <Search size={16} className="absolute left-3.5 top-3.5 text-smoke/70" />
            {searchQuery && (
              <button
                onClick={() => updateSearchParam("")}
                className="absolute right-3.5 top-3.5 text-smoke/70 hover:text-ivory"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-up">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-obsidian-border bg-obsidian-light/20 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-obsidian-soft border border-obsidian-border text-gold/60 mb-4">
                <HelpCircle size={22} />
              </div>
              <h3 className="font-display text-xl text-ivory">No rituals found</h3>
              <p className="mt-2 text-sm text-smoke max-w-sm">
                We couldn't find any products matching your specific filters. Try loosening your keywords or reset all filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-obsidian transition-colors hover:bg-gold-light"
              >
                Reset Filters
              </button>
            </div>
          )}

        </main>
      </div>

      {/* MOBILE FILTERS MODAL */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-obsidian/80 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs overflow-y-auto bg-obsidian-light p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-obsidian-border pb-4 mb-6">
                <h2 className="font-display text-lg text-ivory">Filter Rituals</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-smoke hover:text-ivory"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {["All", "Skincare", "Makeup", "Hair Care", "Fragrance"].map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const label = cat === "Hair Care" ? "Haircare" : cat === "Fragrance" ? "Fragrances" : cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCollection(null);
                          updateCategoryParam(cat);
                        }}
                        className={`rounded-full px-3.5 py-1.5 text-xs transition-all ${
                          isSelected
                            ? "bg-gold text-obsidian font-semibold"
                            : "border border-obsidian-border bg-obsidian/40 text-smoke"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Price</h3>
                <div className="space-y-2">
                  {[
                    { label: "All Prices", value: "All" },
                    { label: "Under $30", value: "under-30" },
                    { label: "$30 to $60", value: "30-60" },
                    { label: "Over $60", value: "over-60" },
                  ].map((range) => {
                    const isSelected = priceFilter === range.value;
                    return (
                      <button
                        key={range.value}
                        onClick={() => {
                          setSelectedCollection(null);
                          setPriceFilter(range.value);
                        }}
                        className={`flex w-full items-center gap-3 py-1 text-left text-sm ${
                          isSelected ? "text-gold font-semibold" : "text-smoke"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected ? "border-gold" : "border-obsidian-border"
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                        </span>
                        <span>{range.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Product Status</h3>
                <div className="space-y-2.5">
                  {["Bestseller", "New", "Sale", "Limited"].map((badge) => {
                    const isChecked = selectedBadges.includes(badge);
                    return (
                      <button
                        key={badge}
                        onClick={() => toggleBadgeFilter(badge)}
                        className={`flex w-full items-center gap-3 py-1 text-left text-sm ${
                          isChecked ? "text-gold font-semibold" : "text-smoke"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            isChecked ? "border-gold bg-gold/10" : "border-obsidian-border"
                          }`}
                        >
                          {isChecked && <span className="h-1.5 w-1.5 rounded-sm bg-gold" />}
                        </span>
                        <span>{badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-obsidian-border pt-4 mt-6">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full rounded-full border border-obsidian-border py-2.5 text-xs text-smoke hover:text-ivory mb-2"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-full bg-gold py-2.5 text-xs font-semibold text-obsidian"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

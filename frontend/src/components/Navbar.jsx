import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X, Heart, Moon, Sun, ArrowRight } from "lucide-react";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { fetchCart, fetchWishlist, searchProducts } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from "../supabaseClient.js";

const links = [
  { label: "Shop All", href: "/collections" },
  { label: "Skincare", href: "/collections?category=Skincare" },
  { label: "Makeup", href: "/collections?category=Makeup" },
  { label: "Fragrance", href: "/collections?category=Fragrance" },
  { label: "Custom Beauty", href: "/custom-beauty" },
  { label: "Haircare", href: "/collections?category=Hair%20Care" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container") && !e.target.closest(".search-button")) {
        setShowSearch(false);
      }
    };
    if (showSearch) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutsideUser = (e) => {
      if (!e.target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      window.addEventListener("click", handleClickOutsideUser);
    }
    return () => window.removeEventListener("click", handleClickOutsideUser);
  }, [showUserDropdown]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      const results = await searchProducts(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const normQ = searchQuery.toLowerCase().replace(/\s+/g, ' ').trim();

    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      navigate(`/product/${searchResults[selectedIndex].id}`);
    } else {
      const exactMatches = searchResults.filter(
        (p) => (p.name || '').toLowerCase().replace(/\s+/g, ' ').trim() === normQ
      );
      if (exactMatches.length === 1) {
        navigate(`/product/${exactMatches[0].id}`);
      } else if (searchResults.length === 1) {
        navigate(`/product/${searchResults[0].id}`);
      } else {
        navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
    setShowSearch(false);
  };

  const handleKeyDown = (e) => {
    if (!showSearch || !searchResults.length) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    }
  };

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const items = await fetchCart();
        const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
        setCartCount(totalQty);
      } catch (e) {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, [user]);

  useEffect(() => {
    const updateWishlistCount = async () => {
      try {
        const items = await fetchWishlist();
        setWishlistCount(items.length);
      } catch (e) {
        setWishlistCount(0);
      }
    };
    updateWishlistCount();
    window.addEventListener("wishlist-updated", updateWishlistCount);
    return () => {
      window.removeEventListener("wishlist-updated", updateWishlistCount);
    };
  }, [user]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-obsidian-border bg-obsidian/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <ShadeSwatch color="#C9A769" size="sm" />
          <span className="font-display text-2xl italic tracking-wide text-ivory">
            LUMÉ
          </span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="text-sm font-medium text-ivory/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="text-ivory/80 transition-colors hover:text-gold"
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          
          <div className="relative flex items-center search-container">
            <button
              onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }}
              aria-label="Search"
              className="search-button text-ivory/80 transition-colors hover:text-gold z-20 relative"
            >
              <Search size={19} />
            </button>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${showSearch ? 'opacity-100 translate-x-0 w-80' : 'opacity-0 translate-x-4 w-0 pointer-events-none'}`}>
              <form onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products..." 
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-full py-2 pl-4 pr-10 text-sm text-ivory focus:outline-none focus:border-gold shadow-lg"
                />
              </form>
              
              {/* Autocomplete Dropdown */}
              {showSearch && searchQuery.trim() && (
                <div className="absolute top-full mt-3 right-0 w-80 bg-obsidian-light border border-obsidian-border rounded-xl shadow-card overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-smoke">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-[60vh] overflow-y-auto">
                      {searchResults.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            navigate(`/product/${product.id}`);
                          }}
                          className={`flex items-center gap-3 w-full p-3 text-left transition-colors border-b border-obsidian-border/50 last:border-0 ${
                            selectedIndex === index ? "bg-obsidian-soft border-l-2 border-l-gold" : "hover:bg-obsidian-soft border-l-2 border-l-transparent"
                          }`}
                        >
                          <div className="h-12 w-12 rounded-lg bg-obsidian-soft flex-shrink-0 flex items-center justify-center p-1 border border-obsidian-border overflow-hidden">
                            {product.bottle ? (
                              <img src={`/bottles/${product.bottle}.png`} alt={product.name} className="h-full object-contain drop-shadow-md" onError={(e) => e.target.style.display = 'none'} />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-gold/50" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-ivory truncate">{product.name}</h4>
                            <p className="text-[10px] uppercase tracking-wider text-gold truncate mt-0.5">{product.category}</p>
                          </div>
                          <div className="text-sm font-display text-ivory">
                            ${product.price}
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setShowSearch(false);
                          navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
                        }}
                        className="w-full p-3 text-xs text-center text-gold hover:bg-gold/10 font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 bg-obsidian-soft/50"
                      >
                        View all results <ArrowRight size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-smoke">This product is currently unavailable.</div>
                  )}
                </div>
              )}
            </div>
          </div>
          {user ? (
            <div className="relative user-dropdown-container">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 text-ivory/80 hover:text-gold transition-colors focus:outline-none py-1"
              >
                <User size={19} />
                <span className="text-sm font-medium hidden md:inline truncate max-w-[120px]">
                  {user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0]}
                </span>
              </button>
              
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-obsidian-light border border-obsidian-border rounded-xl shadow-card py-2 z-50">
                  <div className="px-4 py-2 border-b border-obsidian-border/50">
                    <p className="text-[10px] text-smoke uppercase tracking-wider font-semibold">Signed in as</p>
                    <p className="text-sm text-ivory font-medium truncate mt-0.5">
                      {user.user_metadata?.name || user.user_metadata?.full_name || user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex w-full items-center px-4 py-2 text-sm text-ivory/80 hover:text-gold hover:bg-obsidian-soft transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await supabase.auth.signOut();
                      navigate("/");
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-rose hover:bg-rose/10 transition-colors border-t border-obsidian-border/30 mt-1"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-ivory/80 transition-colors hover:text-gold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-gold hover:bg-gold-light text-obsidian px-4 py-1.5 rounded-full transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
          <button
            onClick={() => navigate("/wishlist")}
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative text-ivory/80 transition-colors hover:text-gold"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[10px] font-bold text-obsidian">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/cart")}
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative text-ivory/80 transition-colors hover:text-gold"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-obsidian">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <button
          className="text-ivory lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-obsidian-border bg-obsidian px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-5">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-ivory/85 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!user ? (
              <>
                <li className="border-t border-obsidian-border/55 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-ivory/85 transition-colors hover:text-gold"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-gold transition-colors hover:text-gold-light"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="border-t border-obsidian-border/55 pt-4">
                  <div className="text-xs text-smoke font-medium">
                    Signed in as <span className="text-ivory font-semibold">{user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0]}</span>
                  </div>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-ivory/85 transition-colors hover:text-gold"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await supabase.auth.signOut();
                      navigate("/");
                    }}
                    className="text-base font-medium text-rose transition-colors hover:text-rose-light text-left w-full"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-obsidian-border pt-6">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="text-ivory/80 hover:text-gold"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/collections");
              }}
              aria-label="Search"
              className="text-ivory/80 hover:text-gold"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate(user ? "/profile" : "/login");
              }}
              aria-label="Account"
              className="text-ivory/80 hover:text-gold"
            >
              <User size={20} />
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/wishlist");
              }}
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative text-ivory/80 hover:text-gold"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[10px] font-bold text-obsidian">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/cart");
              }}
              aria-label={`Shopping bag, ${cartCount} items`}
              className="relative text-ivory/80 hover:text-gold"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-obsidian">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

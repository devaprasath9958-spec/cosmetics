import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X, Heart, Moon, Sun } from "lucide-react";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

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
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const stored = localStorage.getItem("lume-cart");
        if (stored) {
          const parsed = JSON.parse(stored);
          const totalQty = parsed.reduce((sum, item) => sum + item.qty, 0);
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const stored = localStorage.getItem("lume-wishlist");
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlistCount(parsed.length);
        } else {
          setWishlistCount(0);
        }
      } catch (e) {
        setWishlistCount(0);
      }
    };
    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlist-updated", updateWishlistCount);
    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlist-updated", updateWishlistCount);
    };
  }, []);

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
          
          <div className="relative flex items-center">
            <button
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
              className="text-ivory/80 transition-colors hover:text-gold z-10 relative"
            >
              <Search size={19} />
            </button>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${showSearch ? 'opacity-100 translate-x-0 w-64' : 'opacity-0 translate-x-4 w-0 pointer-events-none'}`}>
              <form onSubmit={(e) => { e.preventDefault(); navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`); setShowSearch(false); }}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." 
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-full py-2 pl-4 pr-10 text-sm text-ivory focus:outline-none focus:border-gold"
                />
              </form>
            </div>
          </div>
          <button
            onClick={() => navigate("/profile")}
            aria-label="Account"
            className="text-ivory/80 transition-colors hover:text-gold"
          >
            <User size={19} />
          </button>
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
                navigate("/profile");
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

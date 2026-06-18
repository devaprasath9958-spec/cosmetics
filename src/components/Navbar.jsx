import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";

const links = [
  { label: "Skincare", href: "#categories" },
  { label: "Makeup", href: "#products" },
  { label: "Fragrance", href: "#products" },
  { label: "Offers", href: "#offers" },
  { label: "Journal", href: "#reviews" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
        <a href="#" className="flex items-center gap-2">
          <ShadeSwatch color="#C9A769" size="sm" />
          <span className="font-display text-2xl italic tracking-wide text-ivory">
            LUMÉ
          </span>
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-ivory/80 transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <button aria-label="Search" className="text-ivory/80 transition-colors hover:text-gold">
            <Search size={19} />
          </button>
          <button aria-label="Account" className="text-ivory/80 transition-colors hover:text-gold">
            <User size={19} />
          </button>
          <button
            aria-label="Shopping bag, 2 items"
            className="relative text-ivory/80 transition-colors hover:text-gold"
          >
            <ShoppingBag size={19} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-obsidian">
              2
            </span>
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
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-ivory/85 transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-6 border-t border-obsidian-border pt-6">
            <button aria-label="Search" className="text-ivory/80 hover:text-gold">
              <Search size={20} />
            </button>
            <button aria-label="Account" className="text-ivory/80 hover:text-gold">
              <User size={20} />
            </button>
            <button aria-label="Shopping bag" className="text-ivory/80 hover:text-gold">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

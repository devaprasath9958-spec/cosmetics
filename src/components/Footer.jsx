import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Skincare", href: "/collections?category=Skincare" },
      { label: "Makeup", href: "/collections?category=Makeup" },
      { label: "Fragrance", href: "/collections?category=Fragrance" },
      { label: "Haircare", href: "/collections?category=Hair%20Care" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & Returns", href: "/contact" },
      { label: "FAQs", href: "/contact" },
      { label: "Contact Us", href: "/contact" },
      { label: "Track Order", href: "/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Sustainability", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Press", href: "/about" },
    ],
  },
];

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="border-t border-obsidian-border bg-obsidian-light/30">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <ShadeSwatch color="#C9A769" size="sm" />
              <span className="font-display text-2xl italic text-ivory">LUMÉ</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">
              Skincare, color and fragrance formulated for radiance that
              lasts — without compromise on what goes into the formula.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-obsidian-border text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-widest2 text-ivory/90">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-smoke transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-obsidian-border pt-8 sm:flex-row">
          <p className="text-xs text-smoke">
            &copy; {new Date().getFullYear()} LUMÉ Cosmetics. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-smoke">
            <Link to="/about" className="transition-colors hover:text-gold">Privacy Policy</Link>
            <Link to="/about" className="transition-colors hover:text-gold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

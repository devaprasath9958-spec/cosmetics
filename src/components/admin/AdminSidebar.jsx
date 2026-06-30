import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Tag,
  Award,
  Percent,
  BookOpen,
  Mail,
  MessageSquare,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext.jsx";
import ShadeSwatch from "../ui/ShadeSwatch.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/brands", label: "Brands", icon: Award },
  { to: "/admin/offers", label: "Offers", icon: Percent },
  { to: "/admin/collections", label: "Collections", icon: Layers },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    onNavigate?.();
  };

  return (
    <>
      <div className="border-b border-obsidian-border px-6 py-5">
        <div className="flex items-center gap-2">
          <ShadeSwatch color="#C9A769" size="sm" />
          <div>
            <span className="font-display text-xl italic text-ivory">LUMÉ</span>
            <span className="ml-1.5 text-[10px] uppercase tracking-widest text-gold">Admin</span>
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-smoke">
          <Shield size={11} className="text-gold/70" />
          Store Management Portal
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-gold/10 text-gold border border-gold/30 font-medium"
                  : "text-smoke hover:bg-obsidian-light/50 hover:text-ivory border border-transparent"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-obsidian-border p-4 space-y-2">
        <Link
          to="/"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs text-smoke hover:text-gold transition-colors"
        >
          <ExternalLink size={14} />
          View Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs text-smoke hover:text-rose transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-obsidian-border bg-obsidian-light text-ivory lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={18} />
      </button>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-obsidian-border bg-obsidian-light/40 lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-obsidian-light shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 text-smoke hover:text-ivory"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

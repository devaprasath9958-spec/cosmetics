import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";

export default function CategoryCard({ category }) {
  const { name, count, icon, swatches = [] } = category;
  const Icon = Icons[icon] ?? Icons.Sparkles;
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/collections?category=${encodeURIComponent(name)}`)}
      className="group flex flex-col items-start rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card"
    >
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
        {swatches.map((color, i) => (
          <span
            key={color + i}
            className="absolute h-9 w-9 rounded-full border border-obsidian/60 transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: color,
              left: `${i * 8}px`,
              top: `${i * 4}px`,
              zIndex: swatches.length - i,
              opacity: 0.92,
            }}
          />
        ))}
        <Icon
          size={16}
          className="absolute -bottom-1 -right-1 z-10 rounded-full bg-obsidian p-1 text-gold"
          style={{ width: 22, height: 22 }}
        />
      </div>

      <h3 className="font-display text-lg text-ivory">{name}</h3>
      <p className="mt-1 text-sm text-smoke">{count}</p>
    </button>
  );
}

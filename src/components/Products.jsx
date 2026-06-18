import { useState } from "react";
import SectionHeading from "./ui/SectionHeading.jsx";
import ProductCard from "./ui/ProductCard.jsx";
import Button from "./ui/Button.jsx";
import { products } from "../data/products.js";
import { ArrowRight } from "lucide-react";

const filters = ["All", "Skincare", "Makeup", "Fragrance", "Hair Care"];

export default function Products() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Best of the catalog"
          title="Loved, repeatedly."
          description="The pieces our community reorders the moment the last drop runs out."
          className="mb-0"
        />
      </div>

      <div className="mb-10 mt-8 flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              active === f
                ? "border-gold bg-gold text-obsidian"
                : "border-obsidian-border text-smoke hover:border-gold/50 hover:text-ivory"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button variant="outline">
          View Full Catalog <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}

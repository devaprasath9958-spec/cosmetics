import { useState, useEffect } from "react";
import SectionHeading from "./ui/SectionHeading.jsx";
import ProductCard from "./ui/ProductCard.jsx";
import Button from "./ui/Button.jsx";
import { fetchProducts } from "../services/api.js";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const filters = ["All", "Skincare", "Makeup", "Fragrance", "Hair Care"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

export default function Products() {
  const [active, setActive] = useState("All");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const load = () => {
      fetchProducts().then(p => {
        setProducts(p);
        setIsLoading(false);
      });
    };
    load();
    window.addEventListener("products-updated", load);
    return () => window.removeEventListener("products-updated", load);
  }, []);

  const visible =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
      {/* Background glow */}
      <div className="absolute top-40 left-0 -z-10 h-96 w-96 rounded-full bg-rose/5 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"
      >
        <SectionHeading
          eyebrow="Best of the catalog"
          title="Loved, repeatedly."
          description="The pieces our community reorders the moment the last drop runs out."
          className="mb-0"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-10 mt-8 flex flex-wrap gap-3"
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              active === f
                ? "border-gold bg-gold text-obsidian shadow-lg shadow-gold/20"
                : "border-obsidian-border text-smoke hover:border-gold/50 hover:text-ivory"
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-80 w-full animate-pulse rounded-2xl bg-obsidian-light/50" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {visible.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 flex justify-center"
      >
        <Button variant="outline" className="group border-ivory/20 hover:border-ivory">
          View Full Catalog <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
}

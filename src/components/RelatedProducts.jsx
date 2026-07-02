import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Eye, Check } from "lucide-react";
import { fetchCart, updateCartItem } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function RelatedProducts({ products = [] }) {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [addedMap, setAddedMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  if (!products || products.length === 0) return null;

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth("Please sign in to add items to your cart.")) return;

    setLoadingMap((prev) => ({ ...prev, [product.id]: true }));
    try {
      const cart = await fetchCart();
      const existing = cart.find((i) => i.id === product.id);
      const newQty = existing ? existing.qty + 1 : 1;
      const result = await updateCartItem(product, newQty);
      if (result?.success !== false) {
        window.dispatchEvent(new Event("cart-updated"));
        setAddedMap((prev) => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 2000);
      }
    } catch (err) {
      console.error("RelatedProducts add to cart error:", err);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <section className="py-16 border-t border-obsidian-border mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-display text-3xl text-ivory">You May Also Like</h2>
          <Link to="/collections" className="text-gold hover:text-gold-light transition-colors text-sm font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const isAdded = addedMap[product.id];
            const isLoading = loadingMap[product.id];
            const imageUrl = product.image ||
              "https://images.unsplash.com/photo-1631214499505-87bd3be5e7e6?auto=format&fit=crop&q=80&w=800";

            return (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-obsidian-soft">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={isLoading}
                      className="flex-1 bg-gold text-obsidian py-3 rounded-lg font-semibold text-sm hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isAdded ? (
                        <><Check className="w-4 h-4" /> Added</>
                      ) : isLoading ? (
                        "Adding..."
                      ) : (
                        <><ShoppingBag className="w-4 h-4" /> Add</>
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                      className="w-12 h-12 bg-obsidian-light text-ivory flex items-center justify-center rounded-lg hover:text-gold transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-smoke text-sm mb-1">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-ivory font-display text-lg group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-ivory font-medium">${(product.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { X, ShoppingBag, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCart, updateCartItem } from "../../services/api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function QuickViewModal({ product, onClose }) {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!requireAuth("Please sign in to add items to your cart.")) return;
    setAdding(true);
    try {
      const cart = await fetchCart();
      const existing = cart.find((i) => i.id === product.id);
      const newQty = existing ? existing.qty + 1 : 1;
      const result = await updateCartItem(product, newQty);
      if (result?.success !== false) {
        window.dispatchEvent(new Event("cart-updated"));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (err) {
      console.error("QuickView add to cart error:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onClose && onClose(e);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-obsidian-light border border-obsidian-border rounded-2xl w-full max-w-4xl overflow-hidden shadow-card flex flex-col md:flex-row z-10 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-obsidian-soft/50 hover:bg-obsidian-soft p-2 rounded-full text-smoke hover:text-ivory transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-obsidian-soft">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2 text-gold">
            <Star className="w-4 h-4 fill-gold" />
            <span className="text-sm font-medium">{product.rating || "4.9"} ({product.reviews || 128} reviews)</span>
          </div>

          <h2 className="font-display text-3xl text-ivory mb-2">{product.name}</h2>
          <p className="text-gold font-medium text-xl mb-6">${(product.price || 0).toFixed(2)}</p>

          <p className="text-smoke mb-8 line-clamp-3">
            {product.description || "Experience luxurious coverage with our signature formula. Blends seamlessly for a flawless finish that lasts all day while nourishing your skin."}
          </p>

          <div className="space-y-4 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <ShoppingBag className="w-5 h-5" />
              {adding ? "Adding..." : added ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button
              onClick={handleViewDetails}
              className="w-full bg-obsidian-soft hover:bg-obsidian-border border border-obsidian-border text-ivory font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

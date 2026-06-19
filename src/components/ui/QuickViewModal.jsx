import React from "react";
import { X, ShoppingBag, Star } from "lucide-react";

export default function QuickViewModal({ product, onClose }) {
  if (!product) return null;

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
          <p className="text-gold font-medium text-xl mb-6">${product.price.toFixed(2)}</p>
          
          <p className="text-smoke mb-8 line-clamp-3">
            {product.description || "Experience luxurious coverage with our signature formula. Blends seamlessly for a flawless finish that lasts all day while nourishing your skin."}
          </p>

          <div className="space-y-4 mt-auto">
            <button className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>
            <button 
              onClick={onClose}
              className="w-full bg-obsidian-soft hover:bg-obsidian-border border border-obsidian-border text-ivory font-semibold py-4 rounded-lg transition-colors"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

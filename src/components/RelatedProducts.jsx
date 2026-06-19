import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";

// Mock data - ideally passed as props or fetched
const relatedProducts = [
  {
    id: 3,
    name: "Radiant Blush",
    price: 32.0,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
    category: "Cheeks"
  },
  {
    id: 4,
    name: "Luminous Foundation",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1631214499505-87bd3be5e7e6?auto=format&fit=crop&q=80&w=800",
    category: "Face"
  },
  {
    id: 5,
    name: "Midnight Mascara",
    price: 28.0,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800",
    category: "Eyes"
  }
];

export default function RelatedProducts({ onQuickView }) {
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
          {relatedProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-obsidian-soft">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                  <button className="flex-1 bg-gold text-obsidian py-3 rounded-lg font-semibold text-sm hover:bg-gold-light transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Add
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onQuickView) onQuickView(product);
                    }}
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
                  <p className="text-ivory font-medium">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

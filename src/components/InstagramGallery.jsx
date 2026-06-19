import React from "react";
import { Instagram } from "lucide-react";

const instagramImages = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1615397323861-55c3c0d83637?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
];

export default function InstagramGallery() {
  return (
    <section className="py-20 border-t border-obsidian-border bg-obsidian">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <Instagram className="w-8 h-8 text-gold mb-4" />
          <h2 className="font-display text-3xl md:text-4xl text-ivory mb-2">Follow Us on Instagram</h2>
          <p className="text-smoke">@lumecosmetics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {instagramImages.map((img, i) => (
            <a 
              key={i} 
              href="#" 
              className="relative group overflow-hidden rounded-xl aspect-square block"
            >
              <img 
                src={img} 
                alt={`Instagram ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

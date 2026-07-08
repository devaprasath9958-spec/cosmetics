import React from "react";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";

const instagramImages = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1615397323861-55c3c0d83637?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function InstagramGallery() {
  return (
    <section className="py-20 border-t border-obsidian-border bg-obsidian relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 right-0 -z-10 h-80 w-80 rounded-full bg-rose/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mb-12 text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="rounded-full bg-gradient-to-tr from-gold to-rose p-0.5 mb-5 shadow-lg shadow-rose/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-obsidian">
              <Instagram className="w-6 h-6 text-gold" />
            </div>
          </motion.div>
          <h2 className="font-display text-3xl md:text-4xl text-ivory mb-2">Follow Us on Instagram</h2>
          <p className="text-smoke">@lumecosmetics</p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {instagramImages.map((img, i) => (
            <motion.a 
              key={i} 
              href="#" 
              variants={item}
              className="relative group overflow-hidden rounded-2xl aspect-square block border border-ivory/5 shadow-xl"
            >
              <img 
                src={img} 
                alt={`Instagram ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <Instagram className="w-8 h-8 text-ivory mb-2 translate-y-4 transition-transform duration-300 group-hover:translate-y-0" />
                <span className="text-xs font-semibold text-ivory tracking-widest uppercase opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">Shop Look</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

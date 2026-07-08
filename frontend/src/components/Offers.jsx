import { useState, useEffect } from "react";
import { ArrowRight, Gift, Percent } from "lucide-react";
import Button from "./ui/Button.jsx";
import { motion } from "framer-motion";
import { fetchOffers } from "../services/api.js";

export default function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers().then(setOffers);
  }, []);

  return (
    <section id="offers" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-[100px] bg-obsidian-light/20 blur-[80px]" />
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {offers.map((offer, index) => {
          const isPrimary = offer.accent === "gold";
          const Icon = offer.type === "percentage" ? Percent : Gift;
          const bgHover = isPrimary ? "hover:border-gold/40 hover:shadow-gold/10" : "hover:border-rose/40 hover:shadow-rose/10";
          const iconColor = isPrimary ? "text-gold" : "text-rose";
          const glowColor = isPrimary ? "bg-gold/10" : "bg-rose/10";
          
          return (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 80 }}
              className={`group relative overflow-hidden rounded-[2.5rem] border ${isPrimary ? "border-gold/20" : "border-rose/20"} bg-gradient-to-br from-obsidian-light/80 to-obsidian-soft/80 p-10 backdrop-blur-md transition-all hover:shadow-2xl ${bgHover}`}
            >
              <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${glowColor} blur-[60px] transition-transform duration-700 group-hover:scale-125`} />
              <div className="relative z-10">
                <Icon size={32} className={`mb-6 drop-shadow-md ${iconColor}`} />
                <h3 className="font-display text-3xl text-ivory sm:text-4xl">
                  {offer.title}
                </h3>
                <p className="mt-4 max-w-sm text-lg text-smoke">
                  {offer.description}
                </p>
                <Button 
                  variant={isPrimary ? "primary" : "outline"} 
                  className={`mt-8 transition-all group-hover:-translate-y-1 ${isPrimary ? "shadow-lg shadow-gold/20" : "border-rose/30 text-ivory group-hover:border-rose group-hover:bg-rose/10"}`}
                >
                  {offer.linkText} <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

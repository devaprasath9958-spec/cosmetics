import { ArrowRight, Sparkles, Star } from "lucide-react";
import Button from "./ui/Button.jsx";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";
import { motion, useScroll, useTransform } from "framer-motion";

const swatchRow = ["#C9A769", "#D98C9B", "#8B3A4B", "#E2C893", "#A99CAE"];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <section className="relative overflow-hidden bg-obsidian pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden" aria-hidden="true">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-60 -left-20 h-[500px] w-[500px] rounded-full bg-rose/10 blur-[100px]" 
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        
        {/* Left Content */}
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="show" 
          className="order-2 z-10 lg:order-1"
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center rounded-full bg-gold/20 p-1.5 backdrop-blur-md">
              <Sparkles size={14} className="text-gold" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              The Radiance Collection
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-5xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
            Reveal your <br />
            <span className="relative inline-block">
              <em className="relative z-10 font-medium italic text-gold">luminous</em>
              <span className="absolute bottom-1 left-0 -z-10 h-3 w-full bg-gold/20 blur-sm" />
            </span>{" "}
            truth.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-lg text-lg leading-relaxed text-smoke sm:text-xl">
            High-performance skincare and vibrant color cosmetics, formulated with botanical actives. For beauty that speaks without making a sound.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-5">
            <Button variant="primary" className="group flex items-center gap-2 shadow-lg shadow-gold/20 transition-all hover:shadow-gold/40 hover:-translate-y-1">
              Shop the Edit <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" className="border-smoke/30 text-ivory hover:border-ivory hover:bg-ivory/5 transition-all">
              Discover Ingredients
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 flex items-center gap-4 border-t border-smoke/10 pt-8">
            <div className="flex -space-x-2">
              {swatchRow.map((c, i) => (
                <motion.div 
                  key={c} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.8 + (i * 0.1) }}
                >
                  <ShadeSwatch color={c} size="md" className="ring-4 ring-obsidian shadow-sm" />
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-ivory">40+ Inclusive Shades</span>
              <span className="text-xs text-smoke">Find your perfect match</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Images */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative order-1 flex h-[500px] w-full items-center justify-center lg:order-2 lg:h-[650px]"
        >
          {/* Main Hero Image */}
          <motion.div style={{ y: y1 }} className="absolute z-10 h-[85%] w-[85%] overflow-hidden rounded-[2.5rem] border border-ivory/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200" 
              alt="Lumé Cosmetics Cloud Blush" 
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Inner gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
          </motion.div>

          {/* Floating Glassmorphism Card */}
          <motion.div 
            style={{ y: y2 }} 
            className="absolute -left-6 bottom-10 z-20 flex items-center gap-4 rounded-2xl border border-ivory/10 bg-obsidian/60 p-4 backdrop-blur-xl shadow-2xl sm:bottom-20 sm:left-[-2rem]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Star size={20} className="fill-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ivory">Award Winning</p>
              <p className="text-xs text-smoke">Allure Best of Beauty 2026</p>
            </div>
          </motion.div>

          {/* Floating Swatch element */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-20 z-20 rounded-full border border-ivory/20 bg-obsidian-light/80 p-2 backdrop-blur-lg shadow-xl"
          >
            <ShadeSwatch color="#D98C9B" size="xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

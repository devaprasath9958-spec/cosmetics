import { ArrowRight, Gift, Percent } from "lucide-react";
import Button from "./ui/Button.jsx";
import { motion } from "framer-motion";

export default function Offers() {
  return (
    <section id="offers" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-[100px] bg-obsidian-light/20 blur-[80px]" />
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          className="group relative overflow-hidden rounded-[2.5rem] border border-gold/20 bg-gradient-to-br from-obsidian-light/80 to-obsidian-soft/80 p-10 backdrop-blur-md transition-all hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/10"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-[60px] transition-transform duration-700 group-hover:scale-125" />
          <div className="relative z-10">
            <Percent size={32} className="mb-6 text-gold drop-shadow-md" />
            <h3 className="font-display text-3xl text-ivory sm:text-4xl">
              The Holiday Glow Edit
            </h3>
            <p className="mt-4 max-w-sm text-lg text-smoke">
              Up to 25% off limited-edition sets — bundled rituals for skin
              that photographs as good as it feels.
            </p>
            <Button variant="primary" className="mt-8 shadow-lg shadow-gold/20 transition-all group-hover:-translate-y-1">
              Shop the Edit <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 80 }}
          className="group relative overflow-hidden rounded-[2.5rem] border border-rose/20 bg-gradient-to-br from-obsidian-light/80 to-obsidian-soft/80 p-10 backdrop-blur-md transition-all hover:border-rose/40 hover:shadow-2xl hover:shadow-rose/10"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose/10 blur-[60px] transition-transform duration-700 group-hover:scale-125" />
          <div className="relative z-10">
            <Gift size={32} className="mb-6 text-rose drop-shadow-md" />
            <h3 className="font-display text-3xl text-ivory sm:text-4xl">
              Refer a Friend
            </h3>
            <p className="mt-4 max-w-sm text-lg text-smoke">
              Give $20, get $20. Share your link and turn your favorite
              rituals into something they discover too.
            </p>
            <Button variant="outline" className="mt-8 border-rose/30 text-ivory transition-all group-hover:-translate-y-1 group-hover:border-rose group-hover:bg-rose/10">
              Get My Link <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import SectionHeading from "./ui/SectionHeading.jsx";
import CategoryCard from "./ui/CategoryCard.jsx";
import { fetchCategories } from "../services/api.js";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 relative">
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
      >
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your ritual."
          description="From first cleanse to final spritz — every category formulated with the same dermatological rigor."
        />
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={item}>
            <CategoryCard category={category} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}


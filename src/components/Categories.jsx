import SectionHeading from "./ui/SectionHeading.jsx";
import CategoryCard from "./ui/CategoryCard.jsx";
import { categories } from "../data/products.js";

export default function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your ritual."
          description="From first cleanse to final spritz — every category formulated with the same dermatological rigor."
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

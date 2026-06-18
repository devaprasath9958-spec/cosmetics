import SectionHeading from "./ui/SectionHeading.jsx";
import ReviewCard from "./ui/ReviewCard.jsx";
import { reviews } from "../data/products.js";

export default function Reviews() {
  return (
    <section id="reviews" className="bg-obsidian-light/40 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="From the community"
          title="What people are saying."
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

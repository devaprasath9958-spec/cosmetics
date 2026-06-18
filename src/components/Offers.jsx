import { ArrowRight, Gift, Percent } from "lucide-react";
import Button from "./ui/Button.jsx";

export default function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-obsidian-light to-obsidian-soft p-9">
          <Percent size={28} className="mb-6 text-gold" />
          <h3 className="font-display text-2xl text-ivory sm:text-3xl">
            The Holiday Glow Edit
          </h3>
          <p className="mt-3 max-w-sm text-smoke">
            Up to 25% off limited-edition sets — bundled rituals for skin
            that photographs as good as it feels.
          </p>
          <Button variant="primary" className="mt-7">
            Shop the Edit <ArrowRight size={16} />
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-rose/25 bg-gradient-to-br from-obsidian-light to-obsidian-soft p-9">
          <Gift size={28} className="mb-6 text-rose" />
          <h3 className="font-display text-2xl text-ivory sm:text-3xl">
            Refer a Friend
          </h3>
          <p className="mt-3 max-w-sm text-smoke">
            Give $20, get $20. Share your link and turn your favorite
            rituals into something they discover too.
          </p>
          <Button variant="outline" className="mt-7">
            Get My Link <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}

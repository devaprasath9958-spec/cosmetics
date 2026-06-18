import { ArrowRight, Sparkles } from "lucide-react";
import Button from "./ui/Button.jsx";
import ShadeSwatch from "./ui/ShadeSwatch.jsx";
import BottleIllustration from "./ui/BottleIllustration.jsx";

const swatchRow = ["#C9A769", "#D98C9B", "#8B3A4B", "#E2C893", "#A99CAE"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-fade" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        <div className="order-2 lg:order-1">
          <div className="mb-5 flex items-center gap-2 opacity-0 animate-fade-up [animation-delay:0ms]">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest2 text-gold">
              New — The Radiance Ritual
            </span>
          </div>

          <h1 className="font-display text-4xl leading-[1.1] text-ivory text-balance opacity-0 animate-fade-up [animation-delay:120ms] sm:text-5xl lg:text-6xl">
            Your skin&rsquo;s <em className="text-gold font-medium italic">quiet</em>
            <br />
            confidence.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-smoke opacity-0 animate-fade-up [animation-delay:240ms]">
            Skincare, color and fragrance formulated with dermatologist-grade
            actives — so the only thing anyone notices is you.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 opacity-0 animate-fade-up [animation-delay:360ms]">
            <Button variant="primary">
              Shop the Edit <ArrowRight size={16} />
            </Button>
            <Button variant="outline">Explore Rituals</Button>
          </div>

          <div className="mt-10 flex items-center gap-3 opacity-0 animate-fade-up [animation-delay:480ms]">
            <div className="flex -space-x-1.5">
              {swatchRow.map((c) => (
                <ShadeSwatch key={c} color={c} size="md" className="ring-2 ring-obsidian" />
              ))}
            </div>
            <span className="text-sm text-smoke">32 shades, formulated for every skin tone</span>
          </div>
        </div>

        <div className="relative order-1 flex items-center justify-center lg:order-2">
          <div className="absolute h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
          <div className="absolute h-56 w-56 translate-x-10 translate-y-10 rounded-full bg-rose/10 blur-3xl" aria-hidden="true" />

          <div className="relative flex h-80 w-80 items-center justify-center rounded-[2.5rem] border border-obsidian-border bg-obsidian-light/50 backdrop-blur sm:h-96 sm:w-96">
            <BottleIllustration
              variant="bottle"
              from="#E2C893"
              to="#8B3A4B"
              className="h-56 w-auto drop-shadow-2xl sm:h-72"
            />

            <ShadeSwatch
              color="#D98C9B"
              size="xl"
              className="absolute -left-4 top-10 shadow-card"
            />
            <ShadeSwatch
              color="#C9A769"
              size="lg"
              className="absolute -right-2 bottom-16 shadow-card"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

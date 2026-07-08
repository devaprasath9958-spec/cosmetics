import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "./ui/Button.jsx";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { fetchProducts } from "../services/api.js";
import { useCartActions } from "../hooks/useCartActions.js";

export default function Trending() {
  const containerRef = useRef(null);
  const [product, setProduct] = useState(null);
  const { addToCart, isAdding, isAdded } = useCartActions();
  const adding = product ? isAdding(product.id) : false;
  const added  = product ? isAdded(product.id)  : false;
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts();
        const found = products.find(p => p.name.includes("Luminous Silk Primer") || p.name.includes("Primer"));
        if (found) {
          setProduct(found);
        }
      } catch (err) {
        console.error("Failed to load trending product", err);
      }
    };
    loadProduct();
  }, []);

  const handleAdd = async () => {
    if (!product || adding) return;
    await addToCart(product);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scale the image slightly as we scroll down
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  // Subtle rotation for the blur orb
  const orbRotation = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section 
      id="trending" 
      ref={containerRef}
      className="relative bg-obsidian py-0 lg:h-[200vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dynamic Glowing Orb Background */}
        <motion.div 
          style={{ rotate: orbRotation }}
          className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[150px]"
        />

        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 lg:grid-cols-2">
          {/* Left: Sticky Image (Pinned) */}
          <div className="relative flex h-[50vh] w-full items-center justify-center p-8 lg:h-full lg:p-16">
            <motion.div 
              style={{ scale: imageScale }}
              className="relative h-full w-full max-h-[700px] overflow-hidden rounded-[3rem] border border-ivory/10 shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=1200" 
                alt="Luminous Silk Primer" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-obsidian-light/60 px-3 py-1 text-xs font-semibold tracking-widest text-gold backdrop-blur-md">
                    <Sparkles size={12} /> #1 TRENDING
                  </span>
                  <p className="font-display text-3xl text-ivory drop-shadow-md">{product ? product.name : "Luminous Silk Primer"}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Scrolling Content Container */}
          {/* We use a spacer approach so the right side "scrolls" over the fixed left side in desktop view. */}
          <div className="relative flex h-[50vh] flex-col justify-center px-8 lg:h-full lg:px-16">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="max-w-md"
            >
              <h2 className="font-display text-5xl leading-tight text-ivory sm:text-6xl">
                The secret to <em className="text-gold italic font-medium">glass</em> skin.
              </h2>
              
              <p className="mt-6 text-lg text-smoke">
                Going viral for a reason. Our ultra-lightweight Luminous Silk Primer blurs pores, hydrates deeply, and creates the ultimate glowing canvas.
              </p>

              <div className="mt-10 space-y-6 border-t border-ivory/10 pt-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    1
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-ivory">Hyaluronic Infusion</h4>
                    <p className="mt-1 text-sm text-smoke">Plumps the skin and locks in moisture for 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    2
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-ivory">Micro-Pearl Technology</h4>
                    <p className="mt-1 text-sm text-smoke">Reflects light to instantly blur imperfections.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-ivory">${product ? product.price : "42"}</span>
                  <span className="text-xs text-smoke">Free shipping</span>
                </div>
                <Button 
                  variant="primary" 
                  className={`flex-1 justify-center shadow-lg transition-all duration-300 ${
                    added 
                      ? "bg-ivory text-obsidian shadow-gold/20" 
                      : "shadow-gold/20 hover:shadow-gold/40"
                  }`}
                  onClick={handleAdd}
                  disabled={!product || adding}
                >
                  {added ? (
                    <>
                      Added to Cart <Check size={16} className="ml-2" />
                    </>
                  ) : adding ? (
                    "Adding..."
                  ) : (
                    <>
                      Add to Cart <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

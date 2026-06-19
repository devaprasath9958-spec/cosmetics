import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Makeup Artist",
    content: "The Luminous Foundation has completely changed my kit. It provides flawless coverage while looking like actual skin. My clients are obsessed.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "Beauty Enthusiast",
    content: "I've struggled with sensitive skin for years, but Lumé's skincare line is so gentle yet effective. The glow is real!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=emily"
  },
  {
    id: 3,
    name: "Jessica Taylor",
    role: "Verified Buyer",
    content: "The packaging alone is stunning, but the actual products exceed expectations. The Velvet Lipstick stays on all day without drying my lips.",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=jessica"
  },
  {
    id: 4,
    name: "Amanda Rivera",
    role: "Skincare Blogger",
    content: "Their commitment to cruelty-free ingredients is what drew me in, but the undeniable results are what made me a loyal customer.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=amanda"
  }
];

export default function TestimonialsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl mb-4 text-ivory">What Our Community Says</h1>
          <p className="text-smoke max-w-2xl mx-auto">Real reviews from makeup artists, beauty enthusiasts, and loyal Lumé customers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-obsidian-light p-8 rounded-2xl border border-obsidian-border relative">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-obsidian-soft pointer-events-none" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-gold text-gold' : 'fill-obsidian-soft text-obsidian-soft'}`} 
                  />
                ))}
              </div>
              
              <p className="text-ivory mb-8 text-lg leading-relaxed relative z-10">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                />
                <div>
                  <h4 className="text-ivory font-medium">{testimonial.name}</h4>
                  <p className="text-smoke text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

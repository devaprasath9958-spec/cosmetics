import React, { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { fetchReviews } from "../services/api.js";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchReviews().then(setTestimonials);
  }, []);

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
              
              <p className="text-ivory mb-8 text-lg leading-relaxed relative z-10">"{testimonial.content || testimonial.quote || testimonial.comment}"</p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name || testimonial.customer || 'User')}&background=1a1a1a&color=d4af37`} 
                  alt={testimonial.name || testimonial.customer} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                />
                <div>
                  <h4 className="text-ivory font-medium">{testimonial.name || testimonial.customer}</h4>
                  <p className="text-smoke text-sm">{testimonial.role || (testimonial.productName ? `Reviewed ${testimonial.productName}` : "Verified Buyer")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

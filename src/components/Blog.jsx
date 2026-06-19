import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "The Ultimate Guide to Evening Skincare Routines",
    excerpt: "Discover the secrets to waking up with glowing, refreshed skin using our signature evening routine.",
    author: "Emma Stone",
    date: "Oct 15, 2026",
    image: "https://images.unsplash.com/photo-1615397323861-55c3c0d83637?auto=format&fit=crop&q=80&w=800",
    category: "Skincare"
  },
  {
    id: 2,
    title: "5 Fall Makeup Trends You Need to Try",
    excerpt: "From deep berry lips to subtle metallic eyeshadows, explore the hottest trends this autumn.",
    author: "Sophie Chen",
    date: "Oct 12, 2026",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800",
    category: "Makeup"
  },
  {
    id: 3,
    title: "Demystifying Hyaluronic Acid",
    excerpt: "Everything you need to know about this powerhouse ingredient and how to incorporate it into your routine.",
    author: "Dr. Amanda Rivera",
    date: "Oct 08, 2026",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    category: "Ingredients"
  }
];

export default function Blog() {
  return (
    <div className="pt-24 pb-16 min-h-screen px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl mb-4 text-ivory">Lumé Journal</h1>
          <p className="text-smoke max-w-2xl mx-auto">Beauty tips, skincare advice, and behind-the-scenes stories from our experts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-obsidian-light rounded-xl overflow-hidden border border-obsidian-border hover:border-gold transition-colors group">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-sm text-gold px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-smoke mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                </div>
                
                <h2 className="font-display text-xl text-ivory mb-3 line-clamp-2">
                  <Link to={`/blog/${post.id}`} className="hover:text-gold transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-smoke text-sm mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-gold hover:text-gold-light text-sm font-medium transition-colors group/btn">
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

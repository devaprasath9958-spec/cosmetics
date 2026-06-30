import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContact } from "../services/api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success"

  const validate = () => {
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "We need your name to address you.";
    if (!form.email.trim()) {
      tempErrors.email = "Please share your email so we can reply.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Please provide a valid email format.";
    }
    if (!form.message.trim()) tempErrors.message = "Please write a brief note.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    
    const result = await submitContact(form);
    
    if (result.success) {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus("idle");
      console.error(result.error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 animate-fade-up">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold font-medium">Contact Us</span>
        </div>
        <span className="text-[10px] text-smoke italic">Client Care</span>
      </div>

      {/* Header Banner */}
      <div className="relative mb-16 overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/40 p-8 md:p-10">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-radial-fade blur-3xl opacity-60" />
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-gold">
            <Mail size={14} />
            <span>Concierge Desk</span>
          </div>
          <h1 className="font-display text-3xl font-normal italic tracking-wide text-ivory sm:text-4xl">
            Connect With LUMÉ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-smoke">
            Have questions about our formulations, shades, order tracking, or sustainability? Our concierge team is here to assist your beauty ritual.
          </p>
        </div>
      </div>

      {/* Main Grid: Form vs Info */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        
        {/* Left Column: Contact Form (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6 md:p-8 relative">
          
          {status === "success" && (
            <div className="absolute inset-0 bg-obsidian/95 rounded-2xl z-20 flex flex-col items-center justify-center text-center p-6 animate-fade-up">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold mb-5 shadow-glow">
                <CheckCircle2 size={26} strokeWidth={2} />
              </div>
              <h3 className="font-display text-2xl text-ivory">Message Received</h3>
              <p className="mt-2 text-sm text-smoke max-w-xs leading-relaxed">
                Thank you for reaching out. A beauty concierge advisor will review your message and respond within 24 business hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full border border-obsidian-border bg-obsidian-soft px-5 py-2 text-xs font-semibold text-smoke hover:border-gold/30 hover:text-gold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          )}

          <h2 className="font-display text-xl text-ivory border-b border-obsidian-border pb-4 mb-6">
            Inquiry Submission
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Email Group */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs uppercase tracking-wider text-smoke font-medium">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Juliet Mercer"
                  className={`w-full rounded-xl border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50 ${
                    errors.name ? "border-rose/50 focus:border-rose/65" : "border-obsidian-border"
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose flex items-center gap-1 mt-1 font-medium pl-1">
                    <AlertCircle size={10} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs uppercase tracking-wider text-smoke font-medium">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. juliet@ritual.com"
                  className={`w-full rounded-xl border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50 ${
                    errors.email ? "border-rose/50 focus:border-rose/65" : "border-obsidian-border"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose flex items-center gap-1 mt-1 font-medium pl-1">
                    <AlertCircle size={10} />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs uppercase tracking-wider text-smoke font-medium">Subject / Department</label>
              <select
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50"
              >
                <option value="" className="bg-obsidian-light text-smoke">General Consultation</option>
                <option value="Orders" className="bg-obsidian-light text-smoke">Order Support & Deliveries</option>
                <option value="Shades" className="bg-obsidian-light text-smoke">Shade Matching Assistance</option>
                <option value="Press" className="bg-obsidian-light text-smoke">PR & Brand Partnerships</option>
                <option value="Sustainability" className="bg-obsidian-light text-smoke">Refills & Sustainability</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs uppercase tracking-wider text-smoke font-medium">Your Message *</label>
              <textarea
                id="message"
                value={form.message}
                rows={5}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How may our concierge support your ritual today?"
                className={`w-full rounded-xl border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50 ${
                  errors.message ? "border-rose/50 focus:border-rose/65" : "border-obsidian-border"
                }`}
              />
              {errors.message && (
                <p className="text-[11px] text-rose flex items-center gap-1 mt-1 font-medium pl-1">
                  <AlertCircle size={10} />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-semibold text-obsidian shadow-glow hover:bg-gold-light transition-all disabled:opacity-40"
            >
              {status === "sending" ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-obsidian border-t-transparent" />
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Column: Contact Details & Mock Map (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Details Card */}
          <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6 space-y-6">
            <h2 className="font-display text-lg text-ivory border-b border-obsidian-border pb-3">
              The Flagship Boutique
            </h2>

            <div className="space-y-4">
              {[
                { icon: MapPin, label: "Address", content: "1024 Orchid Ave, Soho, New York, NY 10011" },
                { icon: Phone, label: "Concierge Phone", content: "+1 (800) 585-LUME" },
                { icon: Mail, label: "Client Care Email", content: "concierge@lumecosmetics.com" },
                { icon: Clock, label: "Retail Hours", content: (
                  <div className="space-y-0.5">
                    <p>Mon – Sat: 10:00 AM – 7:00 PM</p>
                    <p>Sunday: 12:00 PM – 6:00 PM</p>
                  </div>
                )}
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start text-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-obsidian border border-obsidian-border text-gold/80 mt-0.5">
                    <item.icon size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">{item.label}</span>
                    <div className="text-ivory mt-1 font-medium leading-relaxed">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Premium Vector Mock Map */}
          <div className="relative group overflow-hidden rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-4">
            <div className="text-[10px] uppercase tracking-widest text-smoke font-medium mb-3 flex items-center justify-between">
              <span>Retail Location Map</span>
              <span className="text-gold flex items-center gap-1 font-semibold">
                Soho, NY
              </span>
            </div>

            {/* Stylized CSS Vector Map Area */}
            <div className="h-44 w-full rounded-xl bg-obsidian border border-obsidian-border relative overflow-hidden flex items-center justify-center shadow-inner">
              {/* Grid block overlays */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(201,167,105,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,167,105,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              {/* Simulated Map Streets */}
              <div className="absolute h-0.5 w-full bg-obsidian-border top-12 left-0 transform rotate-6" />
              <div className="absolute h-0.5 w-full bg-obsidian-border top-28 left-0 transform -rotate-12" />
              <div className="absolute w-0.5 h-full bg-obsidian-border left-20 top-0 transform rotate-12" />
              <div className="absolute w-0.5 h-full bg-obsidian-border left-64 top-0 transform -rotate-6" />
              <div className="absolute h-0.5 w-full bg-gold/15 top-20 left-0 transform -rotate-3 border-dashed border-t border-gold/10" />

              {/* Park representation */}
              <div className="absolute top-4 right-10 h-10 w-16 bg-rose-deep/5 border border-rose-deep/10 rounded-lg blur-[1px]" />
              {/* River representation */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-obsidian-light border-t border-obsidian-border" />

              {/* Glowing Flagship Boutique Marker */}
              <a 
                href="https://maps.google.com/?q=1024+Orchid+Ave+Soho+New+York"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group/pin hover:scale-105 transition-transform"
              >
                {/* Ping waves */}
                <span className="absolute h-8 w-8 rounded-full bg-gold/25 animate-ping opacity-75" />
                <span className="absolute h-4 w-4 rounded-full bg-gold/40 animate-ping opacity-90" />
                
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gold bg-obsidian text-gold shadow-glow">
                  <MapPin size={14} className="animate-bounce" />
                </div>
                <div className="mt-1 bg-obsidian-soft/90 backdrop-blur-sm border border-gold/30 px-2 py-0.5 rounded text-[8px] font-bold text-gold uppercase tracking-wider shadow-md">
                  LUMÉ SOHO
                </div>
              </a>
            </div>

            {/* Map Action Button */}
            <a
              href="https://maps.google.com/?q=1024+Orchid+Ave+Soho+New+York"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block w-full text-center rounded-xl border border-obsidian-border bg-obsidian/30 py-2.5 text-xs text-smoke font-semibold hover:border-gold/30 hover:text-gold transition-colors"
            >
              Open in Google Maps
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

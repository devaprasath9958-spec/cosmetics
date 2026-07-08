import React, { useState } from "react";
import { Package, Search, CheckCircle2, Clock, Truck, Home } from "lucide-react";

export default function OrderTracking() {
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId) setIsTracking(true);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl mb-4 text-ivory">Track Your Order</h1>
          <p className="text-smoke">Enter your order number to check the current delivery status.</p>
        </div>

        <form onSubmit={handleTrack} className="mb-12 relative max-w-xl mx-auto">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Tracking ID (e.g., LUME-12345)"
            className="w-full bg-obsidian-light border border-obsidian-border rounded-full pl-6 pr-32 py-4 text-ivory focus:outline-none focus:border-gold transition-colors shadow-card"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-gold hover:bg-gold-light text-obsidian px-6 rounded-full font-semibold transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Track
          </button>
        </form>

        {isTracking && (
          <div className="bg-obsidian-light border border-obsidian-border rounded-xl p-8 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 border-b border-obsidian-border pb-6">
              <div>
                <p className="text-smoke text-sm mb-1">Order Number</p>
                <p className="text-ivory font-display text-xl">{trackingId}</p>
              </div>
              <div className="text-right">
                <p className="text-smoke text-sm mb-1">Expected Delivery</p>
                <p className="text-gold font-medium">Oct 24, 2026</p>
              </div>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-obsidian-border" />

              <div className="space-y-8">
                <div className="relative flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold flex items-center justify-center z-10 shrink-0">
                    <Home className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-ivory font-medium mb-1">Delivered</h3>
                    <p className="text-smoke text-sm">Pending</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gold text-obsidian flex items-center justify-center z-10 shrink-0 shadow-glow">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-ivory font-medium mb-1">Out for Delivery</h3>
                    <p className="text-smoke text-sm">Today, 09:41 AM - Courier is out for delivery.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-obsidian-soft border border-gold/50 flex items-center justify-center z-10 shrink-0">
                    <Package className="w-5 h-5 text-gold/80" />
                  </div>
                  <div>
                    <h3 className="text-ivory font-medium mb-1">Shipped</h3>
                    <p className="text-smoke text-sm">Oct 22, 02:30 PM - Package left the fulfillment center.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-obsidian-soft border border-gold/50 flex items-center justify-center z-10 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-gold/80" />
                  </div>
                  <div>
                    <h3 className="text-ivory font-medium mb-1">Order Confirmed</h3>
                    <p className="text-smoke text-sm">Oct 21, 10:15 AM - Payment successful, preparing order.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

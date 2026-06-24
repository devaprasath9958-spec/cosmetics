import React from "react";
import { CreditCard, Truck, ShieldCheck, MapPin, Lock } from "lucide-react";

export default function Checkout() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          <h1 className="font-display text-4xl text-ivory mb-6">Checkout</h1>

          {/* Shipping Address */}
          <section className="bg-obsidian-light p-6 rounded-xl border border-obsidian-border shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-gold w-6 h-6" />
              <h2 className="font-display text-2xl text-ivory">Shipping Address</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full md:col-span-2 bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                placeholder="City"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </section>

          {/* Delivery Options */}
          <section className="bg-obsidian-light p-6 rounded-xl border border-obsidian-border shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-gold w-6 h-6" />
              <h2 className="font-display text-2xl text-ivory">Delivery Method</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 border border-gold rounded-lg bg-gold/5 cursor-pointer">
                <input type="radio" name="delivery" defaultChecked className="accent-gold w-5 h-5" />
                <div className="flex-1">
                  <span className="block font-medium text-ivory">Standard Delivery</span>
                  <span className="block text-sm text-smoke">3-5 Business Days</span>
                </div>
                <span className="font-medium text-ivory">Free</span>
              </label>
              <label className="flex items-center gap-4 p-4 border border-obsidian-border rounded-lg hover:border-gold transition-colors cursor-pointer">
                <input type="radio" name="delivery" className="accent-gold w-5 h-5" />
                <div className="flex-1">
                  <span className="block font-medium text-ivory">Express Delivery</span>
                  <span className="block text-sm text-smoke">1-2 Business Days</span>
                </div>
                <span className="font-medium text-ivory">$15.00</span>
              </label>
            </div>
          </section>

          {/* Payment Info */}
          <section className="bg-obsidian-light p-6 rounded-xl border border-obsidian-border shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-gold w-6 h-6" />
              <h2 className="font-display text-2xl text-ivory">Payment Details</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div>
          <div className="bg-obsidian-light p-6 rounded-xl border border-obsidian-border shadow-card sticky top-24">
            <h2 className="font-display text-2xl text-ivory mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-smoke">Luminous Foundation x1</span>
                <span className="text-ivory font-medium">$45.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-smoke">Velvet Lipstick x2</span>
                <span className="text-ivory font-medium">$56.00</span>
              </div>
            </div>

            <div className="border-t border-obsidian-border pt-4 space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-smoke">Subtotal</span>
                <span className="text-ivory">$101.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-smoke">Shipping</span>
                <span className="text-ivory">Free</span>
              </div>
              <div className="flex justify-between items-center text-lg font-medium">
                <span className="text-ivory">Total</span>
                <span className="text-gold">$101.00</span>
              </div>
            </div>

            <button className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Place Order
            </button>
            <p className="text-xs text-smoke text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

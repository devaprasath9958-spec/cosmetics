import React, { useState, useEffect } from "react";
import { CreditCard, Truck, ShieldCheck, MapPin, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCart, saveOrder, getAuthenticatedUser } from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryMethod: "Standard",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  useEffect(() => {
    const initializeCheckout = async () => {
      const user = await getAuthenticatedUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const cartItems = await fetchCart();
      if (cartItems.length === 0) {
        navigate("/cart");
        return;
      }
      setCart(cartItems);
      setLoading(false);
    };
    initializeCheckout();
  }, [navigate]);

  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const shippingCost = formData.deliveryMethod === "Express" ? 15 : 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    const orderData = {
      status: "Processing",
      statusText: "Order confirmed and being prepared.",
      total,
      shippingCost,
      taxCost: 0,
      subtotal,
      paymentMethod: "Credit Card ending in " + formData.cardNumber.slice(-4),
      shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city} ${formData.zipCode}`,
      carrier: formData.deliveryMethod === "Express" ? "FedEx" : "USPS",
      timeline: [
        { status: "Order Placed", date: new Date().toISOString(), completed: true },
        { status: "Processing", date: null, completed: false },
        { status: "Shipped", date: null, completed: false },
        { status: "Delivered", date: null, completed: false }
      ]
    };

    const orderId = await saveOrder(orderData);
    if (orderId) {
      navigate("/orders");
    } else {
      setPlacingOrder(false);
      alert("Failed to place order.");
    }
  };

  if (loading) {
    return <div className="pt-32 text-center text-ivory min-h-screen">Loading checkout...</div>;
  }

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
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="First Name"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last Name"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
                className="w-full md:col-span-2 bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                required
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
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
              <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === 'Standard' ? 'border-gold bg-gold/5' : 'border-obsidian-border hover:border-gold'}`}>
                <input 
                  type="radio" 
                  name="delivery"
                  checked={formData.deliveryMethod === "Standard"}
                  onChange={() => setFormData({ ...formData, deliveryMethod: "Standard" })}
                  className="accent-gold w-5 h-5" 
                />
                <div className="flex-1">
                  <span className="block font-medium text-ivory">Standard Delivery</span>
                  <span className="block text-sm text-smoke">3-5 Business Days</span>
                </div>
                <span className="font-medium text-ivory">Free</span>
              </label>
              <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === 'Express' ? 'border-gold bg-gold/5' : 'border-obsidian-border hover:border-gold'}`}>
                <input 
                  type="radio" 
                  name="delivery"
                  checked={formData.deliveryMethod === "Express"}
                  onChange={() => setFormData({ ...formData, deliveryMethod: "Express" })}
                  className="accent-gold w-5 h-5" 
                />
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
                required
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                placeholder="Card Number"
                className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                />
                <input
                  type="text"
                  required
                  value={formData.cvc}
                  onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
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
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-smoke truncate max-w-[150px]">{item.name} x{item.qty}</span>
                  <span className="text-ivory font-medium">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-obsidian-border pt-4 space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-smoke">Subtotal</span>
                <span className="text-ivory">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-smoke">Shipping</span>
                <span className="text-ivory">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-medium">
                <span className="text-ivory">Total</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <ShieldCheck className="w-5 h-5" />
              {placingOrder ? "Processing..." : "Place Order"}
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

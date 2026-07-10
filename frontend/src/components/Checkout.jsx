import React, { useState, useEffect } from "react";
import { CreditCard, Truck, ShieldCheck, MapPin, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCart, saveOrder, getAuthenticatedUser } from "../services/api";
import { supabase } from "../supabaseClient";
import { createPaymentOrder, verifyPayment } from "../services/backendApi";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [formError, setFormError] = useState("");
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryMethod: "Standard",
  });

  // ── Initialise checkout ──────────────────────────────────────
  useEffect(() => {
    const initializeCheckout = async () => {
      const currentUser = await getAuthenticatedUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      const cartItems = await fetchCart();
      if (cartItems.length === 0) {
        navigate("/cart");
        return;
      }
      setCart(cartItems);

      // Pre-fill default address from user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profile && profile.addresses) {
        const defaultAddr = profile.addresses.find((a) => a.isDefault);
        if (defaultAddr) {
          const names = defaultAddr.name ? defaultAddr.name.split(" ") : ["", ""];
          setFormData((prev) => ({
            ...prev,
            firstName: names[0] || "",
            lastName: names.slice(1).join(" ") || "",
            address: defaultAddr.address || "",
            city: defaultAddr.city || "",
            zipCode: defaultAddr.zipCode || "",
          }));
        }
      }

      setLoading(false);
    };

    initializeCheckout();
  }, [navigate]);

  // ── Totals ───────────────────────────────────────────────────
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const shippingCost = formData.deliveryMethod === "Express" ? 15 : 0;
  const total = subtotal + shippingCost;

  // ── Validate shipping address form ──────────────────────────
  const validateShipping = () => {
    const { firstName, lastName, address, city, zipCode } = formData;
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !zipCode.trim()) {
      setFormError("Please fill in all shipping address fields.");
      return false;
    }
    return true;
  };

  // ── Open Razorpay Checkout modal ─────────────────────────────
  const handlePayNow = async () => {
    if (!validateShipping()) return;

    setFormError("");
    setPlacingOrder(true);

    try {
      // Step 1 — Ask the backend to create a Razorpay order
      // Amount must be in paise (multiply USD/INR amount × 100)
      const amountInPaise = Math.round(total * 100);
      const orderData = await createPaymentOrder(amountInPaise, "INR");

      if (!orderData.success) {
        setFormError("Could not initiate payment. Please try again.");
        setPlacingOrder(false);
        return;
      }

      // Step 2 — Configure the Razorpay Checkout options
      const options = {
        key: orderData.key_id,              // Public key_id from backend
        amount: orderData.amount,           // Amount in paise
        currency: orderData.currency,       // "INR"
        name: "LUMÉ Cosmetics",
        description: `Order — ${cart.length} item${cart.length > 1 ? "s" : ""}`,
        order_id: orderData.order_id,       // Razorpay Order ID

        // ── Payment success handler ──────────────────────────
        handler: async (response) => {
          try {
            // Step 3 — Verify the payment signature on the backend
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verification.success) {
              setFormError("Payment verification failed. Please contact support.");
              setPlacingOrder(false);
              return;
            }

            // Step 4 — Save the order to Supabase after verified payment
            const { firstName, lastName, address, city, zipCode } = formData;
            const savedOrderId = await saveOrder({
              status: "Processing",
              total,
              shippingCost,
              taxCost: 0,
              subtotal,
              paymentMethod: `Razorpay — ${verification.payment_id}`,
              shippingAddress: `${firstName.trim()} ${lastName.trim()}, ${address.trim()}, ${city.trim()} ${zipCode.trim()}`,
              carrier: formData.deliveryMethod === "Express" ? "FedEx" : "USPS",
            });

            if (savedOrderId) {
              navigate("/orders");
            } else {
              setFormError("Payment was successful but order could not be saved. Contact support.");
              setPlacingOrder(false);
            }
          } catch (err) {
            console.error("[Checkout] Post-payment error:", err);
            setFormError("An error occurred after payment. Please contact support.");
            setPlacingOrder(false);
          }
        },

        // ── Pre-fill customer details ────────────────────────
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: user?.email || "",
        },

        // ── Razorpay modal theme ─────────────────────────────
        theme: { color: "#C9A769" }, // Gold — matches brand palette

        // ── Payment failure / modal close handler ────────────
        modal: {
          ondismiss: () => {
            // User closed the modal without paying — reset button
            setPlacingOrder(false);
            setFormError("Payment was cancelled. You can try again.");
          },
        },
      };

      // Step 5 — Open the Razorpay modal
      // window.Razorpay is available because we loaded the SDK in index.html
      if (typeof window.Razorpay === "undefined") {
        setFormError("Razorpay SDK failed to load. Please refresh and try again.");
        setPlacingOrder(false);
        return;
      }

      const rzp = new window.Razorpay(options);

      // Handle payment failure inside the modal (network errors, bank declines)
      rzp.on("payment.failed", (response) => {
        console.error("[Checkout] Payment failed:", response.error);
        setFormError(
          `Payment failed: ${response.error.description || "Please try a different payment method."}`
        );
        setPlacingOrder(false);
      });

      rzp.open();
    } catch (err) {
      console.error("[Checkout] handlePayNow error:", err);
      setFormError("Could not connect to the payment server. Please try again.");
      setPlacingOrder(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pt-32 text-center text-ivory min-h-screen">
        Loading checkout...
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Left Column: Form ── */}
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
              <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === "Standard" ? "border-gold bg-gold/5" : "border-obsidian-border hover:border-gold"}`}>
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
              <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === "Express" ? "border-gold bg-gold/5" : "border-obsidian-border hover:border-gold"}`}>
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

          {/* Payment Method Info */}
          <section className="bg-obsidian-light p-6 rounded-xl border border-obsidian-border shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-gold w-6 h-6" />
              <h2 className="font-display text-2xl text-ivory">Payment</h2>
            </div>
            <p className="text-smoke text-sm leading-relaxed">
              You will be redirected to Razorpay's secure payment gateway to complete
              your purchase. Accepted: Credit/Debit Cards, UPI, Net Banking, Wallets.
            </p>
            {/* Razorpay accepted methods badge row */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["Visa", "Mastercard", "UPI", "Net Banking", "Wallets"].map((method) => (
                <span
                  key={method}
                  className="text-xs px-3 py-1 border border-obsidian-border rounded-full text-smoke"
                >
                  {method}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right Column: Order Summary ── */}
        <div>
          <div className="bg-obsidian-light p-6 rounded-xl border border-obsidian-border shadow-card sticky top-24">
            <h2 className="font-display text-2xl text-ivory mb-6">Order Summary</h2>

            {/* Cart items */}
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-smoke truncate max-w-[150px]">
                    {item.name} x{item.qty}
                  </span>
                  <span className="text-ivory font-medium">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-obsidian-border pt-4 space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-smoke">Subtotal</span>
                <span className="text-ivory">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-smoke">Shipping</span>
                <span className="text-ivory">
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-medium">
                <span className="text-ivory">Total</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Error message */}
            {formError && (
              <div className="mb-4 p-3 bg-rose-deep/20 border border-rose/30 text-rose text-sm rounded-lg text-center">
                {formError}
              </div>
            )}

            {/* Pay Now button — triggers Razorpay modal */}
            <button
              id="razorpay-pay-btn"
              onClick={handlePayNow}
              disabled={placingOrder}
              className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5" />
              {placingOrder ? "Processing..." : "Pay Now"}
            </button>

            <p className="text-xs text-smoke text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secured by Razorpay
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

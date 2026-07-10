import React, { useState, useEffect } from "react";
import { CreditCard, Truck, ShieldCheck, MapPin, Lock, Landmark, Smartphone, Wallet, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCart, saveOrder, getAuthenticatedUser } from "../services/api";
import { supabase } from "../supabaseClient";
import { createPaymentOrder, verifyPayment, recordPayment, recordCodPayment } from "../services/backendApi";

const PAYMENT_METHODS = [
  { id: "razorpay", label: "Razorpay", description: "Cards, UPI, Net Banking, Wallets, EMI, etc.", icon: ShieldCheck, recommended: true },
  { id: "upi", label: "UPI", description: "Google Pay, PhonePe, Paytm, or any UPI app.", icon: Smartphone },
  { id: "credit_card", label: "Credit Card", description: "Visa, Mastercard, RuPay, Amex credit cards.", icon: CreditCard },
  { id: "debit_card", label: "Debit Card", description: "Standard Debit cards accepted.", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", description: "Direct pay via major Indian banks.", icon: Landmark },
  { id: "wallet", label: "Wallets", description: "Pay via Paytm, Amazon Pay, PhonePe, etc.", icon: Wallet },
  { id: "emi", label: "EMI", description: "Easy monthly installments (where supported).", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery (COD)", description: "Pay in cash upon delivery.", icon: DollarSign }
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [formError, setFormError] = useState("");
  const [user, setUser] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

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

  // ── Open Razorpay Checkout or Place COD Order ───────────────────
  const handlePlaceOrder = async () => {
    if (!validateShipping()) return;
    if (!selectedPaymentMethod) {
      setFormError("Please select a payment method.");
      return;
    }

    setFormError("");
    setPlacingOrder(true);

    const { firstName, lastName, address, city, zipCode } = formData;
    const shippingAddress = `${firstName.trim()} ${lastName.trim()}, ${address.trim()}, ${city.trim()} ${zipCode.trim()}`;

    // Handle Cash on Delivery (COD) Flow
    if (selectedPaymentMethod === "cod") {
      try {
        const savedOrderId = await saveOrder({
          status: "Placed",
          order_status: "Placed",
          total,
          total_amount: total,
          shippingCost,
          taxCost: 0,
          subtotal,
          paymentMethod: "Cash on Delivery",
          payment_method: "Cash on Delivery",
          payment_status: "Pending",
          razorpay_order_id: null,
          razorpay_payment_id: null,
          shippingAddress,
          delivery_address: shippingAddress,
          carrier: formData.deliveryMethod === "Express" ? "FedEx" : "USPS",
        });

        if (savedOrderId) {
          // Record COD payment via backend (bypasses RLS)
          try {
            await recordCodPayment({
              supabase_order_id: savedOrderId,
              user_id: user?.id,
              amount: total,
              currency: "INR",
            });
          } catch (payErr) {
            console.warn("[Checkout] COD payment record warning:", payErr);
          }
          navigate(`/track-order?id=${savedOrderId}`);
        } else {
          setFormError("Failed to place Cash on Delivery order. Please try again.");
          setPlacingOrder(false);
        }
      } catch (err) {
        console.error("[Checkout] COD order error:", err);
        setFormError("An error occurred. Please try again.");
        setPlacingOrder(false);
      }
      return;
    }

    // Razorpay flow for online methods
    try {
      // Step 1 — Ask the backend to create a Razorpay order
      const amountInPaise = Math.round(total * 100);
      const orderData = await createPaymentOrder(amountInPaise, "INR");

      if (!orderData.success) {
        setFormError("Could not initiate payment. Please try again.");
        setPlacingOrder(false);
        return;
      }

      // Determine preferred method configuration
      let preferredMethod = selectedPaymentMethod;
      if (preferredMethod === "credit_card" || preferredMethod === "debit_card") {
        preferredMethod = "card";
      }

      // Step 2 — Configure the Razorpay Checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LUMÉ Cosmetics",
        description: `Order — ${cart.length} item${cart.length > 1 ? "s" : ""}`,
        order_id: orderData.order_id,

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
            const savedOrderId = await saveOrder({
              status: "Placed",
              order_status: "Placed",
              total,
              total_amount: total,
              shippingCost,
              taxCost: 0,
              subtotal,
              paymentMethod: `Razorpay (${selectedPaymentMethod})`,
              payment_method: `Razorpay (${selectedPaymentMethod})`,
              payment_status: "Success",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress,
              delivery_address: shippingAddress,
              carrier: formData.deliveryMethod === "Express" ? "FedEx" : "USPS",
            });

            if (savedOrderId) {
              // Record payment via backend (bypasses RLS)
              try {
                await recordPayment({
                  supabase_order_id: savedOrderId,
                  user_id: user?.id,
                  amount: total,
                  currency: "INR",
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  payment_method: `Razorpay — ${selectedPaymentMethod}`,
                });
              } catch (payErr) {
                console.warn("[Checkout] Payment record warning:", payErr);
              }
              navigate(`/track-order?id=${savedOrderId}`);
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

        // ── Pre-fill customer details and set method if not generic "razorpay" ──
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: user?.email || "",
          method: preferredMethod !== "razorpay" ? preferredMethod : undefined,
        },

        theme: { color: "#C9A769" },

        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
            setFormError("Payment was cancelled. You can try again.");
          },
        },
      };

      if (typeof window.Razorpay === "undefined") {
        setFormError("Razorpay SDK failed to load. Please refresh and try again.");
        setPlacingOrder(false);
        return;
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("[Checkout] Payment failed:", response.error);
        setFormError(
          `Payment failed: ${response.error.description || "Please try a different payment method."}`
        );
        setPlacingOrder(false);
      });

      rzp.open();
    } catch (err) {
      console.error("[Checkout] handlePlaceOrder error:", err);
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

          {/* Select Payment Method */}
          <section className="bg-obsidian-light p-6 rounded-xl border border-obsidian-border shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-gold w-6 h-6" />
              <h2 className="font-display text-2xl text-ivory">Select Payment Method</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? "border-gold bg-gold/5 shadow-glow"
                        : "border-obsidian-border hover:border-gold/50 bg-obsidian-soft/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => {
                        setSelectedPaymentMethod(method.id);
                        setFormError("");
                      }}
                      className="accent-gold mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gold shrink-0" />
                        <span className="font-medium text-ivory text-sm">{method.label}</span>
                        {method.recommended && (
                          <span className="text-[9px] font-bold text-obsidian bg-gold rounded px-1.5 py-0.5 uppercase tracking-wide">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-smoke mt-1 leading-normal">
                        {method.description}
                      </span>
                    </div>
                  </label>
                );
              })}
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

            {/* Submit button */}
            <button
              id="razorpay-pay-btn"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-gold hover:bg-gold-light text-obsidian font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5" />
              {placingOrder ? "Processing..." : selectedPaymentMethod === "cod" ? "Place Order (COD)" : "Pay Now"}
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

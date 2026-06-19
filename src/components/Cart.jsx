import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, HelpCircle, Check, CreditCard, Sparkles, Receipt, Percent, X } from "lucide-react";
import BottleIllustration from "./ui/BottleIllustration.jsx";

const DEFAULT_CART = [
  {
    id: "p1",
    name: "Dew Drop Serum",
    subtitle: "Hyaluronic + Vitamin C",
    price: 58,
    qty: 1,
    bottle: "bottle",
    colors: ["#C9A769", "#8B3A4B"],
    selectedShadeIndex: 0
  },
  {
    id: "p2",
    name: "Velvet Matte Lipstick",
    subtitle: "Shade — Café Nude",
    price: 26,
    qty: 1,
    bottle: "tube",
    colors: ["#8B3A4B", "#D98C9B"],
    selectedShadeIndex: 1
  }
];

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0); // decimal percentage e.g. 0.15
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  
  // Checkout process simulation states
  const [checkoutStage, setCheckoutStage] = useState("cart"); // "cart", "paying", "success"
  const [mockOrderNumber, setMockOrderNumber] = useState("");

  // Load cart from localStorage or initialize with default items
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lume-cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        localStorage.setItem("lume-cart", JSON.stringify(DEFAULT_CART));
        setCartItems(DEFAULT_CART);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (e) {
      setCartItems(DEFAULT_CART);
    }
  }, []);

  // Save cart changes to localStorage and dispatch update events
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("lume-cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  // Modify quantity
  const updateQuantity = (itemId, shadeIndex, amount) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId && item.selectedShadeIndex === shadeIndex) {
        const newQty = Math.max(1, item.qty + amount);
        return { ...item, qty: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  // Remove item
  const removeItem = (itemId, shadeIndex) => {
    const updated = cartItems.filter(
      (item) => !(item.id === itemId && item.selectedShadeIndex === shadeIndex)
    );
    saveCart(updated);
  };

  // Promo code validation
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "LUME15") {
      setPromoDiscount(0.15);
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  // Shipping logic (flat $10.00 shipping, free over $100.00 subtotal)
  const shippingThreshold = 100;
  const isShippingFree = subtotal >= shippingThreshold;
  const shippingCost = cartItems.length > 0 && !isShippingFree ? 10.00 : 0.00;
  const shippingToFree = Math.max(0, shippingThreshold - subtotal);

  // Discount calculation
  const discountAmount = useMemo(() => {
    return subtotal * promoDiscount;
  }, [subtotal, promoDiscount]);

  // Taxes (8%)
  const taxRate = 0.08;
  const taxAmount = useMemo(() => {
    return (subtotal - discountAmount) * taxRate;
  }, [subtotal, discountAmount]);

  // Grand Total
  const grandTotal = useMemo(() => {
    return subtotal - discountAmount + shippingCost + taxAmount;
  }, [subtotal, discountAmount, shippingCost, taxAmount]);

  // Checkout process simulation
  const handleProceedToCheckout = () => {
    setCheckoutStage("paying");
    // Generate mock order ID
    const randomId = `LM-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    setMockOrderNumber(randomId);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newOrder = {
      id: randomId,
      date: formattedDate,
      status: "Processing",
      statusText: "Dermatological formulas are being verified and boxed.",
      total: grandTotal,
      shippingCost: shippingCost,
      taxCost: taxAmount,
      subtotal: subtotal,
      paymentMethod: "Credit Card ending in 8831",
      shippingAddress: "1024 Orchid Ave, Suite B, New York, NY 10011",
      carrier: "FedEx Express",
      trackingNumber: `FEDEX-${Math.floor(100000 + Math.random() * 900000)}-LM`,
      items: [...cartItems],
      timeline: [
        { label: "Ordered", date: `${formattedDate}, ${formattedTime}`, completed: true, current: false },
        { label: "Processing", date: `${formattedDate}, ${formattedTime}`, completed: true, current: true },
        { label: "In Transit", date: "Pending shipment", completed: false, current: false },
        { label: "Delivered", date: "Est. 3-5 days", completed: false, current: false }
      ]
    };

    // Simulate Payment delay
    setTimeout(() => {
      try {
        const storedOrders = localStorage.getItem("lume-orders");
        let ordersList = [];
        if (storedOrders) {
          ordersList = JSON.parse(storedOrders);
        } else {
          // If the user hasn't loaded orders yet, we want to copy the initial ones,
          // but we can import mock orders from Orders.jsx. Since we don't import, we will
          // let Orders.jsx initialize itself. If Orders.jsx starts with MOCK_ORDERS, it will merge them.
          // Wait, let's make sure Orders.jsx checks for stored orders.
          // If storedOrders is null, we can initialize it with the MOCK_ORDERS in Orders.jsx,
          // then prepend the new order. To be safe, we will just save the new order.
          // In Orders.jsx, we will write: if storedOrders is found, use it; else, load MOCK_ORDERS,
          // save them to localStorage, and add any new ones.
        }
        ordersList.unshift(newOrder);
        localStorage.setItem("lume-orders", JSON.stringify(ordersList));
        window.dispatchEvent(new Event("orders-updated"));
      } catch (e) {
        console.error("Failed to save order to localStorage:", e);
      }

      setCheckoutStage("success");
      // Clear cart storage on success
      localStorage.setItem("lume-cart", JSON.stringify([]));
      window.dispatchEvent(new Event("cart-updated"));
    }, 2200);
  };

  if (checkoutStage === "paying") {
    return (
      <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="relative flex items-center justify-center mb-8">
          {/* Glowing loader */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gold/15 border-t-gold" />
          <CreditCard className="absolute text-gold animate-pulse" size={22} />
        </div>
        <h2 className="font-display text-2xl text-ivory">Securing Your Rituals</h2>
        <p className="mt-2 text-sm text-smoke max-w-xs leading-relaxed">
          Please do not refresh or close this browser window. Processing your payment details...
        </p>
      </div>
    );
  }

  if (checkoutStage === "success") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center animate-fade-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold mb-6 mx-auto shadow-glow">
          <Check size={30} strokeWidth={2.5} />
        </div>
        <div className="mb-2 text-xs uppercase tracking-widest text-gold font-semibold">Payment Confirmed</div>
        <h1 className="font-display text-4xl text-ivory">Order Placed Successfully!</h1>
        
        <div className="my-8 rounded-2xl border border-obsidian-border bg-obsidian-light/50 p-6 text-left space-y-4 max-w-md mx-auto text-sm">
          <div className="flex justify-between border-b border-obsidian-border/50 pb-3">
            <span className="text-smoke">Order Reference</span>
            <span className="font-semibold text-ivory">#{mockOrderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-obsidian-border/50 pb-3">
            <span className="text-smoke">Est. Delivery</span>
            <span className="text-ivory font-medium">3-5 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-smoke">Status</span>
            <span className="text-gold font-semibold uppercase tracking-wider text-xs bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
              Processing
            </span>
          </div>
        </div>

        <p className="text-sm text-smoke leading-relaxed max-w-md mx-auto mb-8">
          Thank you for choosing LUMÉ. A receipt and shipping details have been sent to your email. You can monitor the progress of your parcel inside your account page.
        </p>

        <div className="flex flex-col gap-3 justify-center sm:flex-row max-w-md mx-auto">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 rounded-full border border-obsidian-border bg-obsidian-light/60 py-3.5 text-sm font-semibold text-smoke hover:border-gold/30 hover:text-gold transition-all"
          >
            Track Order Progress
          </button>
          <button
            onClick={() => navigate("/collections")}
            className="flex-1 rounded-full bg-gold py-3.5 text-sm font-semibold text-obsidian hover:bg-gold-light transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold font-medium">Cart</span>
        </div>
        <span className="text-[10px] text-smoke italic">Shopping Bag</span>
      </div>

      <h1 className="mb-10 font-display text-3xl text-ivory">Your Shopping Bag</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: Cart Items (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Free Shipping Progress bar */}
            <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/35 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-smoke font-medium">
                  {isShippingFree ? (
                    <span className="text-gold flex items-center gap-1">
                      <Sparkles size={13} />
                      Congratulations! You qualified for Free Shipping.
                    </span>
                  ) : (
                    <span>Add <strong className="text-gold">${shippingToFree.toFixed(2)}</strong> more to unlock Free Shipping.</span>
                  )}
                </span>
                <span className="text-smoke/60">Goal: ${shippingThreshold}</span>
              </div>
              <div className="h-1.5 rounded-full bg-obsidian-soft border border-obsidian-border overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                />
              </div>
            </div>

            {/* List of items */}
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div
                  key={item.id + "-" + item.selectedShadeIndex + idx}
                  className="group relative flex items-center justify-between gap-4 rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-5 transition-colors hover:border-gold/20"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    
                    {/* Visual Bottle Illustration */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-obsidian border border-obsidian-border p-2.5 shrink-0">
                      <BottleIllustration
                        variant={item.bottle}
                        from={item.colors[item.selectedShadeIndex]}
                        to={item.colors[1 - item.selectedShadeIndex] || item.colors[0]}
                        className="h-16 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-display text-base text-ivory hover:text-gold transition-colors font-medium"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-smoke">{item.subtitle}</p>
                      
                      {/* Selected color swatch indicator */}
                      {item.colors && (
                        <div className="flex items-center gap-2 text-[10px] text-smoke">
                          <span>Shade:</span>
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-obsidian-border"
                            style={{ backgroundColor: item.colors[item.selectedShadeIndex] }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Actions & Price removal */}
                  <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-8">
                    
                    {/* Quantity controllers */}
                    <div className="flex items-center rounded-full border border-obsidian-border bg-obsidian/30 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedShadeIndex, -1)}
                        disabled={item.qty <= 1}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-smoke hover:text-ivory disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-8 text-center font-display text-xs text-ivory">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedShadeIndex, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-smoke hover:text-ivory"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* Subtotal cost */}
                    <div className="text-right sm:w-20">
                      <span className="font-display text-base text-gold font-medium">${(item.price * item.qty).toFixed(2)}</span>
                      <span className="text-[10px] text-smoke/70 block mt-0.5">${item.price} each</span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.id, item.selectedShadeIndex)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-smoke/70 hover:text-rose hover:bg-rose-deep/10 border border-transparent hover:border-rose/25 transition-all"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Summary card */}
            <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6 space-y-6">
              <h2 className="font-display text-lg text-ivory border-b border-obsidian-border pb-3 flex items-center gap-2">
                <Receipt size={16} className="text-gold" />
                <span>Order Summary</span>
              </h2>

              {/* Price items */}
              <div className="space-y-3.5 text-sm text-smoke">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-ivory">${subtotal.toFixed(2)}</span>
                </div>

                {/* Promo Code Discount */}
                {promoApplied && (
                  <div className="flex justify-between text-rose font-medium bg-rose-deep/10 p-2 rounded border border-rose/30 text-xs">
                    <span className="flex items-center gap-1">
                      <Percent size={12} />
                      Promo Applied (15% Off)
                    </span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Premium Shipping</span>
                  <span className="text-ivory">
                    {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="text-ivory">${taxAmount.toFixed(2)}</span>
                </div>

                {/* Voucher code input */}
                <div className="border-t border-obsidian-border/50 pt-4 mt-2">
                  {!promoApplied ? (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. LUME15)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full rounded-full border border-obsidian-border bg-obsidian/40 px-4 py-2 text-xs text-ivory placeholder-smoke/60 outline-none focus:border-gold/40"
                        />
                        {promoCode && (
                          <button
                            type="button"
                            onClick={() => setPromoCode("")}
                            className="absolute right-3.5 top-2.5 text-smoke/70 hover:text-ivory"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={!promoCode.trim()}
                        className="rounded-full bg-ivory/5 border border-obsidian-border px-4 text-xs font-semibold text-ivory hover:bg-gold hover:text-obsidian disabled:opacity-40 transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between text-xs bg-gold/10 text-gold p-2.5 rounded border border-gold/30">
                      <span>Voucher code Applied!</span>
                      <button
                        onClick={() => {
                          setPromoDiscount(0);
                          setPromoApplied(false);
                          setPromoCode("");
                        }}
                        className="hover:text-gold-light"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose mt-1.5 pl-2 font-medium">Invalid promo code. Try using `LUME15`.</p>
                  )}
                </div>

                {/* Grand total */}
                <div className="flex justify-between border-t border-obsidian-border pt-4 text-base font-semibold text-ivory font-display">
                  <span>Grand Total</span>
                  <span className="text-gold font-medium">${grandTotal.toFixed(2)}</span>
                </div>

              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-semibold text-obsidian shadow-glow hover:bg-gold-light transition-all duration-300"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[10px] text-smoke/80 text-center leading-relaxed">
                Prices and shipping calculations are based on delivery addresses within the United States. Sales tax is finalized upon checkout.
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-obsidian-border bg-obsidian-light/20 py-24 text-center animate-fade-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-obsidian-soft border border-obsidian-border text-gold/60 mb-4 shadow-inner">
            <ShoppingBag size={20} />
          </div>
          <h3 className="font-display text-xl text-ivory">Your bag is empty</h3>
          <p className="mt-2 text-sm text-smoke max-w-xs">
            Look like you haven't added any formulas to your cosmetic bag yet. Explore our selections to get started.
          </p>
          <Link
            to="/collections"
            className="mt-6 rounded-full bg-gold px-6 py-2.5 text-xs font-semibold text-obsidian transition-colors hover:bg-gold-light"
          >
            Shop Collections
          </Link>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Package, Search, CheckCircle2, Clock, Truck, Home, Calendar, MapPin, CreditCard, Sparkles, Box, AlertCircle, ShoppingBag } from "lucide-react";
import { fetchOrderById } from "../services/api.js";
import BottleIllustration from "./ui/BottleIllustration.jsx";

const STAGES = [
  { label: "Order Placed", key: "Placed", desc: "Your order has been received and logged." },
  { label: "Confirmed", key: "Confirmed", desc: "Formulas verified and order confirmed." },
  { label: "Packed", key: "Packed", desc: "Items packed in premium signature boxing." },
  { label: "Shipped", key: "Shipped", desc: "Out of the fulfillment center, handed to partner." },
  { label: "Out for Delivery", key: "Out for Delivery", desc: "Out with local courier for final stretch." },
  { label: "Delivered", key: "Delivered", desc: "Delivered and signature acquired." }
];

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") || "";
  
  const [trackingId, setTrackingId] = useState(queryId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrderById(idToFetch);
      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
        setError("No order found with the provided ID. Please check and try again.");
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while tracking the order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      setTrackingId(queryId);
      loadOrder(queryId);
    }
  }, [queryId]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchParams({ id: trackingId.trim() });
      loadOrder(trackingId.trim());
    }
  };

  // Get current active status index
  const getStatusIndex = (currentStatus) => {
    const statusMap = {
      Placed: 0,
      Confirmed: 1,
      Packed: 2,
      Shipped: 3,
      "Out for Delivery": 4,
      Delivered: 5,
      Cancelled: -1
    };
    return statusMap[currentStatus] !== undefined ? statusMap[currentStatus] : 0;
  };

  const statusIdx = order ? getStatusIndex(order.status) : 0;

  // Estimated delivery date (5 days from creation)
  const getEstDeliveryDate = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 pt-24 lg:px-8 min-h-screen">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold font-medium">Track Order</span>
        </div>
      </div>

      <div className="text-center mb-12">
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-gold">
          <Sparkles size={14} />
          <span>Fulfillment Monitor</span>
        </div>
        <h1 className="font-display text-4xl mb-4 italic tracking-wide text-ivory sm:text-5xl">Track Your Order</h1>
        <p className="text-smoke max-w-md mx-auto">Enter your Order ID (UUID) to follow the real-time shipping progress of your package.</p>
      </div>

      {/* Tracker Search Input */}
      <form onSubmit={handleTrackSubmit} className="mb-12 relative max-w-2xl mx-auto">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Order ID (e.g., e464a4b2-...)"
          className="w-full bg-obsidian-light border border-obsidian-border rounded-full pl-6 pr-36 py-4 text-ivory placeholder-smoke/60 focus:outline-none focus:border-gold transition-colors shadow-card"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-gold hover:bg-gold-light text-obsidian px-6 rounded-full font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Tracking..." : (
            <>
              <Search className="w-4 h-4" /> Track
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="max-w-3xl mx-auto mb-8 flex items-center gap-3 p-4 bg-rose-deep/10 border border-rose/20 rounded-xl text-rose text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      )}

      {!loading && order && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline and Details Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Status Timeline */}
            <div className="bg-obsidian-light/60 border border-obsidian-border rounded-2xl p-6 sm:p-8 shadow-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-obsidian-border/50 pb-6">
                <div>
                  <p className="text-smoke text-xs uppercase tracking-widest mb-1">Order Details</p>
                  <p className="text-ivory font-mono text-sm break-all">ID: {order.id}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-smoke text-xs uppercase tracking-widest mb-1">Estimated Delivery</p>
                  <p className="text-gold font-medium text-lg">
                    {order.status === "Cancelled" ? "Cancelled" : getEstDeliveryDate(order.created_at)}
                  </p>
                </div>
              </div>

              {order.status === "Cancelled" ? (
                <div className="flex items-center gap-3 p-4 bg-obsidian-soft border border-obsidian-border rounded-xl text-smoke">
                  <AlertCircle className="w-5 h-5 text-smoke/70" />
                  <div>
                    <h3 className="font-semibold text-ivory">Order Cancelled</h3>
                    <p className="text-xs">This order has been cancelled and cannot be tracked further.</p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-8 sm:pl-0 mt-8">
                  {/* Stepper Timeline (Vertical for small, Horizontal for large) */}
                  <div className="hidden sm:block absolute left-4 right-4 top-5 h-0.5 bg-obsidian-border -z-10" />
                  <div 
                    className="hidden sm:block absolute left-4 top-5 h-0.5 bg-gold transition-all duration-500 -z-10" 
                    style={{ width: `${(statusIdx / (STAGES.length - 1)) * 94}%` }}
                  />

                  <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-obsidian-border sm:hidden" />
                  <div 
                    className="absolute left-6 top-2 w-0.5 bg-gold sm:hidden transition-all duration-500" 
                    style={{ height: `${(statusIdx / (STAGES.length - 1)) * 96}%` }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-8 sm:gap-4">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx <= statusIdx;
                      const isCurrent = idx === statusIdx;
                      
                      return (
                        <div key={stage.key} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center relative">
                          {/* Node Icon/Circle */}
                          <div 
                            className={`w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 shrink-0 ${
                              isCurrent 
                                ? "bg-gold text-obsidian shadow-glow scale-110" 
                                : isCompleted 
                                ? "bg-gold/20 text-gold border border-gold/40" 
                                : "bg-obsidian-soft border border-obsidian-border text-smoke/60"
                            }`}
                          >
                            {stage.key === "Placed" && <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4" />}
                            {stage.key === "Confirmed" && <CheckCircle2 className="w-5 h-5 sm:w-4 sm:h-4" />}
                            {stage.key === "Packed" && <Box className="w-5 h-5 sm:w-4 sm:h-4" />}
                            {stage.key === "Shipped" && <Truck className="w-5 h-5 sm:w-4 sm:h-4" />}
                            {stage.key === "Out for Delivery" && <Truck className="w-5 h-5 sm:w-4 sm:h-4" />}
                            {stage.key === "Delivered" && <Home className="w-5 h-5 sm:w-4 sm:h-4" />}
                          </div>

                          {/* Node Labels */}
                          <div className="ml-4 sm:ml-0 sm:mt-4">
                            <h4 className={`font-semibold text-sm ${isCurrent ? "text-gold font-bold" : isCompleted ? "text-ivory" : "text-smoke/60"}`}>
                              {stage.label}
                            </h4>
                            <p className="text-[11px] text-smoke mt-0.5 max-w-[120px] hidden sm:block mx-auto leading-tight">
                              {stage.desc}
                            </p>
                            <p className="text-xs text-smoke sm:hidden mt-0.5 leading-tight">
                              {stage.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Purchased Items */}
            <div className="bg-obsidian-light/60 border border-obsidian-border rounded-2xl p-6 sm:p-8 shadow-card">
              <h3 className="font-display text-xl mb-6 text-ivory">Purchased Products</h3>
              <div className="divide-y divide-obsidian-border">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-6 items-center first:pt-0 last:pb-0">
                    <div className="w-20 h-20 bg-obsidian-soft rounded-lg flex items-center justify-center shrink-0 border border-obsidian-border overflow-hidden">
                      {item.image_url || item.image ? (
                        <img 
                          src={item.image_url || item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <BottleIllustration
                          variant={item.bottle || "standard"}
                          from={item.colors?.[0] || "#C9A769"}
                          to={item.colors?.[1] || "#8B3A4B"}
                          className="h-16 w-auto"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base text-ivory truncate">{item.name}</h4>
                      {item.subtitle && <p className="text-xs text-smoke truncate">{item.subtitle}</p>}
                      <p className="text-xs text-smoke mt-1">Quantity: <span className="text-ivory font-medium">{item.qty}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-base text-gold">${(item.price * item.qty).toFixed(2)}</p>
                      <p className="text-xs text-smoke">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info Panel */}
          <div className="space-y-8">
            {/* Delivery Address */}
            <div className="bg-obsidian-light/60 border border-obsidian-border rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-gold w-5 h-5 shrink-0" />
                <h3 className="font-semibold text-ivory text-base">Delivery Address</h3>
              </div>
              <p className="text-smoke text-sm leading-relaxed whitespace-pre-line">
                {order.shippingAddress || "No shipping address details provided."}
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-obsidian-light/60 border border-obsidian-border rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-gold w-5 h-5 shrink-0" />
                <h3 className="font-semibold text-ivory text-base">Payment Summary</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-smoke">Method:</span>
                  <span className="text-ivory font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-smoke">Status:</span>
                  <span className={`font-semibold ${
                    order.status === "Cancelled" ? "text-smoke" : "text-gold"
                  }`}>
                    {order.status === "Cancelled" ? "Voided" : "Paid"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-obsidian-border/50 pt-3 text-base">
                  <span className="text-ivory font-semibold">Total Amount:</span>
                  <span className="text-gold font-display font-bold">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-obsidian-light/60 border border-obsidian-border rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-gold w-5 h-5 shrink-0" />
                <h3 className="font-semibold text-ivory text-base">Order Timeline</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-smoke">Ordered:</span>
                  <span className="text-ivory">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-smoke">Current Status:</span>
                  <span className="text-gold font-semibold">{order.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

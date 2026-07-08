import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, DollarSign, ChevronDown, Check, ArrowRight, Truck, Download, RefreshCcw, Star, HelpCircle, MapPin, CreditCard, Sparkles } from "lucide-react";
import BottleIllustration from "./ui/BottleIllustration.jsx";
import { fetchOrders, fetchCart, updateCartItem } from "../services/api.js";

const statusStyles = {
  "In Transit": "bg-rose-deep/20 text-rose border-rose/30",
  "Processing": "bg-gold/15 text-gold border-gold/30",
  "Delivered": "bg-ivory/10 text-ivory border-ivory/20",
  "Cancelled": "bg-obsidian-border text-smoke border-obsidian-border",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);
  const [successActionId, setSuccessActionId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
        if (data.length > 0) {
          setExpandedOrderId((current) => current || data[0].id);
        }
      } catch (e) {
        setOrders([]);
      }
    };
    loadOrders();
    window.addEventListener("orders-updated", loadOrders);
    return () => window.removeEventListener("orders-updated", loadOrders);
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleDownloadInvoice = (orderId, e) => {
    e.stopPropagation();
    setDownloadingId(orderId);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessActionId({ type: "invoice", id: orderId });
      setTimeout(() => setSuccessActionId(null), 2500);
    }, 1500);
  };

  const handleReorder = (orderId, e) => {
    e.stopPropagation();
    setReorderingId(orderId);
    setTimeout(async () => {
      try {
        const order = orders.find((o) => o.id === orderId);
        if (order && order.items) {
          const cart = await fetchCart();
          for (const item of order.items) {
            const existingIdx = cart.findIndex(
              (cItem) => cItem.id === item.id && cItem.selectedShadeIndex === item.selectedShadeIndex
            );
            const newQty = existingIdx > -1 ? cart[existingIdx].qty + item.qty : item.qty;
            await updateCartItem(item, newQty);
          }
          window.dispatchEvent(new Event("cart-updated"));
        }
      } catch (err) {
        console.error("Reorder failed:", err);
      }
      setReorderingId(null);
      setSuccessActionId({ type: "reorder", id: orderId });
      setTimeout(() => setSuccessActionId(null), 2500);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold font-medium">Orders</span>
        </div>
        <span className="text-[10px] text-smoke italic">Account Dashboard</span>
      </div>

      {/* Page Header */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/40 p-8 md:p-10">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-radial-fade blur-3xl opacity-60" />
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-gold">
            <Sparkles size={14} />
            <span>Customer Lounge</span>
          </div>
          <h1 className="font-display text-3xl font-normal italic tracking-wide text-ivory sm:text-4xl">
            Your Orders
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-smoke">
            Manage your purchases, download invoices, track your parcels in real-time, and quickly re-order your favorite cosmetic rituals.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-12">
        {[
          { label: "Total Orders", value: orders.length, icon: Package, desc: "Completed & active orders" },
          { label: "Lifetime Investment", value: `$${orders.reduce((a, o) => a + (o.total ?? 0), 0).toFixed(2)}`, icon: DollarSign, desc: "Excluding promotional credit" },
          { label: "Active Shipments", value: orders.filter(o => o.status !== "Delivered").length, icon: Truck, desc: "Currently on their way to you" }
        ].map((metric, i) => (
          <div key={i} className="flex items-start justify-between rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-smoke/70">{metric.label}</span>
              <div className="font-display text-2xl text-ivory font-medium">{metric.value}</div>
              <p className="text-[11px] text-smoke/80 leading-tight">{metric.desc}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian-soft border border-obsidian-border text-gold/70">
              <metric.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <h2 className="font-display text-xl text-ivory border-b border-obsidian-border pb-4">Purchase History</h2>

        {orders.length > 0 ? (
          orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isExpanded ? "border-gold/50 bg-obsidian-soft" : "border-obsidian-border bg-obsidian-light/60 hover:border-gold/20"
                }`}
              >
                
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4 sm:flex-1">
                    
                    {/* Order ID */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">Order Reference</span>
                      <span className="text-sm font-semibold text-ivory block mt-0.5">#{order.id}</span>
                    </div>

                    {/* Date */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">Date Placed</span>
                      <div className="flex items-center gap-1.5 text-sm text-smoke mt-0.5">
                        <Calendar size={13} className="text-gold/60" />
                        <span>{order.date}</span>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">Total Amount</span>
                      <span className="text-sm font-display font-medium text-gold block mt-0.5">${order.total.toFixed(2)}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>

                  </div>

                  <div className="flex items-center justify-between border-t border-obsidian-border pt-4 sm:border-0 sm:pt-0 gap-4">
                    <div className="hidden sm:block text-right">
                      <span className="text-xs text-smoke hover:text-gold transition-colors font-medium">
                        {isExpanded ? "Hide Details" : "View Details"}
                      </span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-obsidian border border-obsidian-border text-smoke hover:text-gold">
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-gold" : ""}`}
                      />
                    </div>
                  </div>

                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-obsidian-border/50 bg-obsidian/30 p-6 space-y-8 animate-fade-up">
                    
                    {/* Tracker Milestone bar */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">Shipment Tracking</h4>
                        <span className="text-xs text-smoke italic">{order.statusText}</span>
                      </div>
                      
                      {/* Graphical timeline */}
                      <div className="relative pt-6 pb-2">
                        {/* Horizontal Connector Line */}
                        <div className="absolute left-6 right-6 top-[37px] h-0.5 bg-obsidian-border -z-10 hidden sm:block" />
                        <div
                          className="absolute left-6 top-[37px] h-0.5 bg-gold/50 -z-10 hidden sm:block transition-all duration-500"
                          style={{
                            width:
                              order.status === "Processing" ? "33%" :
                              order.status === "In Transit" ? "66%" :
                              order.status === "Delivered" ? "100%" : "0%"
                          }}
                        />

                        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
                          {(order.timeline ?? []).map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4 sm:flex-col sm:items-center sm:gap-2 sm:flex-1 text-left sm:text-center">
                              
                              {/* Milestone dot */}
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs transition-colors z-10 ${
                                  step.completed
                                    ? "border-gold bg-obsidian text-gold shadow-glow"
                                    : "border-obsidian-border bg-obsidian text-smoke"
                                } ${step.current ? "ring-2 ring-gold/30" : ""}`}
                              >
                                {step.completed && !step.current && <Check size={12} strokeWidth={2.5} />}
                                {step.current && <Truck size={12} />}
                                {!step.completed && idx + 1}
                              </div>

                              <div>
                                <span className={`text-xs font-semibold block ${step.completed ? "text-ivory" : "text-smoke/60"}`}>
                                  {step.label}
                                </span>
                                <span className="text-[10px] text-smoke block mt-0.5 leading-none">
                                  {step.date}
                                </span>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Content details grid (items vs shipping info) */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                      
                      {/* Left: Itemised products (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">Order Items</h4>
                        <div className="space-y-3">
                          {(order.items ?? []).map((item, idx) => (
                            <div
                              key={item.id + idx}
                              className="flex items-center justify-between rounded-xl border border-obsidian-border/50 bg-obsidian-light/35 p-4"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-obsidian p-2 border border-obsidian-border shrink-0">
                                  <BottleIllustration
                                    variant={item.bottle}
                                    from={(item.colors ?? [])[item.selectedShadeIndex] ?? '#C9A769'}
                                    to={(item.colors ?? [])[1 - item.selectedShadeIndex] ?? (item.colors ?? [])[0] ?? '#8B3A4B'}
                                    className="h-12 w-auto drop-shadow-md"
                                  />
                                </div>
                                <div>
                                  <Link to={`/product/${item.id}`} className="font-display text-sm text-ivory hover:text-gold transition-colors font-medium">
                                    {item.name}
                                  </Link>
                                  <p className="text-xs text-smoke mt-0.5">{item.subtitle}</p>
                                  
                                  {/* Swatch & Qty Display */}
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] text-smoke">Qty: {item.qty}</span>
                                    {item.colors?.length > 0 && (
                                       <span className="flex items-center gap-1.5 text-[10px] text-smoke">
                                        Shade:
                                        <span
                                          className="h-2 w-2 rounded-full border border-obsidian-border inline-block"
                                          style={{ backgroundColor: item.colors[item.selectedShadeIndex] ?? item.colors[0] }}
                                        />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-display text-sm text-ivory font-medium">${item.price}</span>
                                <span className="text-[10px] text-smoke block mt-0.5">Total: ${item.price * item.qty}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Courier & Receipts breakdown (5 cols) */}
                      <div className="lg:col-span-5 space-y-6">
                        
                        {/* Logistics info */}
                        <div className="rounded-xl border border-obsidian-border/50 bg-obsidian-light/35 p-5 space-y-4">
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-gold border-b border-obsidian-border/50 pb-2">Logistics & Billing</h4>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <span className="text-smoke flex items-center gap-1"><MapPin size={11} className="text-gold/60" /> Delivery Address</span>
                              <p className="text-ivory leading-tight mt-1">{order.shippingAddress}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-smoke flex items-center gap-1"><CreditCard size={11} className="text-gold/60" /> Payment Info</span>
                              <p className="text-ivory mt-1">{order.paymentMethod}</p>
                              <p className="text-[10px] text-smoke">Courier: {order.carrier}</p>
                              <p className="text-[10px] text-smoke leading-none mt-1">Ref: {order.trackingNumber}</p>
                            </div>
                          </div>
                        </div>

                        {/* Price receipt details */}
                        <div className="space-y-2 border-t border-obsidian-border/40 pt-4 text-xs text-smoke">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-ivory">${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-ivory">
                              {order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sales Tax</span>
                            <span className="text-ivory">${order.taxCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t border-obsidian-border/40 pt-2 text-sm font-semibold text-ivory font-display">
                            <span>Total Charge</span>
                            <span className="text-gold font-medium">${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Bottom Actions for current expanded order */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-obsidian-border/40 sm:flex-row sm:justify-end">
                      <button
                        onClick={(e) => handleDownloadInvoice(order.id, e)}
                        disabled={downloadingId === order.id}
                        className={`flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition-all ${
                          successActionId?.type === "invoice" && successActionId?.id === order.id
                            ? "border-ivory/20 bg-ivory/10 text-ivory"
                            : "border-obsidian-border bg-obsidian-light/50 text-smoke hover:border-gold/30 hover:text-gold"
                        }`}
                      >
                        {downloadingId === order.id ? (
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border border-smoke border-t-transparent" />
                        ) : successActionId?.type === "invoice" && successActionId?.id === order.id ? (
                          <Check size={13} strokeWidth={2.5} />
                        ) : (
                          <Download size={13} />
                        )}
                        <span>
                          {successActionId?.type === "invoice" && successActionId?.id === order.id
                            ? "Receipt Saved"
                            : "Invoice PDF"}
                        </span>
                      </button>

                      <button
                        onClick={(e) => handleReorder(order.id, e)}
                        disabled={reorderingId === order.id}
                        className={`flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
                          successActionId?.type === "reorder" && successActionId?.id === order.id
                            ? "bg-rose-deep text-rose border border-rose/30"
                            : "bg-gold text-obsidian hover:bg-gold-light"
                        }`}
                      >
                        {reorderingId === order.id ? (
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border border-obsidian border-t-transparent" />
                        ) : successActionId?.type === "reorder" && successActionId?.id === order.id ? (
                          <Check size={13} strokeWidth={2.5} />
                        ) : (
                          <RefreshCcw size={13} />
                        )}
                        <span>
                          {successActionId?.type === "reorder" && successActionId?.id === order.id
                            ? "Re-ordered!"
                            : "Buy Again"}
                        </span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-obsidian-border bg-obsidian-light/20 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-obsidian-soft border border-obsidian-border text-gold/60 mb-4">
              <HelpCircle size={22} />
            </div>
            <h3 className="font-display text-xl text-ivory">No orders found</h3>
            <p className="mt-2 text-sm text-smoke max-w-sm">
              You haven't placed any orders under this account yet. Browse our collections to start your first beauty ritual.
            </p>
            <Link
              to="/collections"
              className="mt-6 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-obsidian transition-colors hover:bg-gold-light"
            >
              Shop Collections
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

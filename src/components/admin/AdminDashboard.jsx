import { Link } from "react-router-dom";
import { Package, ShoppingBag, Users, Star, DollarSign, ArrowRight } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminStatCard from "./ui/AdminStatCard.jsx";
import AdminBadge from "./ui/AdminBadge.jsx";

export default function AdminDashboard() {
  const { products, orders, customers, reviews, totalRevenue, pendingReviews } = useAdminData();

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        eyebrow="Overview"
        title="Admin Dashboard"
        description="Monitor store performance, orders, and customer activity at a glance."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <AdminStatCard label="Total Products" value={products.length} icon={Package} description="Active catalog items" />
        <AdminStatCard label="Total Orders" value={orders.length} icon={ShoppingBag} description="All-time orders" />
        <AdminStatCard label="Customers" value={customers.length} icon={Users} description="Registered profiles" />
        <AdminStatCard
          label="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description={`${pendingReviews} pending reviews`}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg text-ivory">Recent Orders</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs text-gold hover:text-gold-light">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-obsidian-border/50 bg-obsidian/30 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ivory">#{order.id}</p>
                    <p className="text-xs text-smoke">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <AdminBadge label={order.status} />
                    <p className="mt-1 text-sm font-medium text-gold">${order.total?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-smoke py-8 text-center">No orders yet. Place an order from the storefront cart.</p>
          )}
        </div>

        <div className="rounded-2xl border border-obsidian-border bg-obsidian-light/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg text-ivory">Pending Reviews</h2>
            <Link to="/admin/reviews" className="flex items-center gap-1 text-xs text-gold hover:text-gold-light">
              Moderate <ArrowRight size={12} />
            </Link>
          </div>
          {reviews.filter((r) => r.status === "Pending").length > 0 ? (
            <div className="space-y-3">
              {reviews
                .filter((r) => r.status === "Pending")
                .slice(0, 4)
                .map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-obsidian-border/50 bg-obsidian/30 px-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-ivory">{review.productName}</p>
                      <div className="flex items-center gap-1 text-gold text-xs">
                        <Star size={12} className="fill-gold" />
                        {review.rating}
                      </div>
                    </div>
                    <p className="text-xs text-smoke line-clamp-2">{review.comment}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-smoke py-8 text-center">All reviews have been moderated.</p>
          )}
        </div>
      </div>
    </div>
  );
}

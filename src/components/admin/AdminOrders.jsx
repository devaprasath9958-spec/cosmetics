import { Trash2 } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";
import AdminBadge from "./ui/AdminBadge.jsx";
import { adminSelectClass } from "./ui/AdminModal.jsx";

const STATUSES = ["Processing", "In Transit", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useAdminData();

  const columns = [
    {
      key: "id",
      label: "Order",
      render: (row) => (
        <div>
          <p className="font-medium text-ivory">#{row.id}</p>
          <p className="text-xs text-smoke">{row.date}</p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row) => (
        <span className="text-ivory">{row.items?.length || 0} item(s)</span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (row) => <span className="font-medium text-gold">${row.total?.toFixed(2)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => updateOrderStatus(row.id, e.target.value)}
          className={`${adminSelectClass} max-w-[140px] py-1.5 text-xs`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: "badge",
      label: "Fulfillment",
      render: (row) => <AdminBadge label={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => {
            if (window.confirm(`Delete order #${row.id}?`)) deleteOrder(row.id);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
          aria-label={`Delete order ${row.id}`}
        >
          <Trash2 size={13} />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Orders Management"
        description="Track and update order statuses. Orders sync with the storefront checkout."
      />
      <AdminTable
        columns={columns}
        data={orders}
        emptyMessage="No orders found. Complete a checkout on the storefront to create orders."
      />
    </div>
  );
}

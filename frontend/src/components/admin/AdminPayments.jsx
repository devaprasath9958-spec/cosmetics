import { useEffect, useState } from "react";
import { CreditCard, Search } from "lucide-react";
import AdminPageHeader from "./ui/AdminPageHeader";
import AdminTable from "./ui/AdminTable";
import AdminBadge from "./ui/AdminBadge";
import { fetchAllPayments } from "../../services/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      const data = await fetchAllPayments();
      setPayments(data);
      setLoading(false);
    };
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const search = searchTerm.toLowerCase();
    const pid = p.razorpay_payment_id?.toLowerCase() || "";
    const email = p.profiles?.email?.toLowerCase() || "";
    return pid.includes(search) || email.includes(search);
  });

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span className="text-smoke text-xs">
          {new Date(row.transaction_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "user",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-ivory">
            {row.profiles?.first_name} {row.profiles?.last_name}
          </p>
          <p className="text-xs text-smoke">{row.profiles?.email}</p>
        </div>
      ),
    },
    {
      key: "payment_id",
      label: "Transaction ID",
      render: (row) => (
        <span className="text-xs font-mono text-smoke">
          {row.razorpay_payment_id || `COD-${row.id.substring(0,8)}`}
        </span>
      ),
    },
    {
      key: "method",
      label: "Method",
      render: (row) => (
        <span className="flex items-center gap-1.5 text-xs text-ivory">
          <CreditCard size={12} className="text-gold" /> {row.payment_method}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <span className="font-medium text-gold">${row.amount.toFixed(2)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <AdminBadge label={row.payment_status} />,
    },
  ];

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        eyebrow="Finance"
        title="Payment Transactions"
        description="View all processed payments from Razorpay and Cash on Delivery."
      />
      
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke w-4 h-4" />
          <input
            type="text"
            placeholder="Search by Payment ID or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-obsidian-soft border border-obsidian-border rounded-lg pl-10 pr-4 py-2 text-sm text-ivory focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={filteredPayments}
        emptyMessage={loading ? "Loading payments..." : "No payments found."}
      />
    </div>
  );
}

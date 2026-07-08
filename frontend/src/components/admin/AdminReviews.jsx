import { Check, X, Trash2, Star } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";
import AdminBadge from "./ui/AdminBadge.jsx";

export default function AdminReviews() {
  const { reviews, updateReviewStatus, deleteReview, pendingReviews } = useAdminData();

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (row) => (
        <div>
          <p className="font-medium text-ivory">{row.productName}</p>
          <p className="text-xs text-smoke">{row.customer}</p>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <div className="flex items-center gap-1 text-gold">
          <Star size={13} className="fill-gold" />
          <span className="text-ivory">{row.rating}/5</span>
        </div>
      ),
    },
    {
      key: "comment",
      label: "Review",
      render: (row) => (
        <p className="max-w-xs text-xs text-smoke line-clamp-2">{row.comment}</p>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) => <span className="text-xs text-smoke">{row.date}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <AdminBadge label={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status !== "Approved" && (
            <button
              onClick={() => updateReviewStatus(row.id, "Approved")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-gold hover:border-gold/30"
              aria-label="Approve review"
              title="Approve"
            >
              <Check size={13} />
            </button>
          )}
          {row.status !== "Rejected" && (
            <button
              onClick={() => updateReviewStatus(row.id, "Rejected")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
              aria-label="Reject review"
              title="Reject"
            >
              <X size={13} />
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm("Delete this review permanently?")) deleteReview(row.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
            aria-label="Delete review"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        eyebrow="Moderation"
        title="Reviews Management"
        description={`Approve, reject, or remove customer product reviews. ${pendingReviews} pending.`}
      />
      <AdminTable columns={columns} data={reviews} emptyMessage="No reviews to moderate." />
    </div>
  );
}

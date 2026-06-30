import { Trash2, Mail } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";

export default function AdminNewsletter() {
  const { newsletterSubscribers, deleteNewsletterSubscriber } = useAdminData();

  const columns = [
    {
      key: "email",
      label: "Email Address",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 border border-gold/20 shrink-0">
            <Mail size={13} className="text-gold" />
          </div>
          <span className="font-medium text-ivory">{row.email}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Subscribed On",
      render: (row) => (
        <span className="text-xs text-smoke">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => {
            if (window.confirm(`Remove "${row.email}" from the newsletter list?`))
              deleteNewsletterSubscriber(row.id);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
          aria-label={`Remove ${row.email}`}
        >
          <Trash2 size={13} />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        eyebrow="Marketing"
        title="Newsletter Subscribers"
        description={`${newsletterSubscribers.length} subscriber${newsletterSubscribers.length !== 1 ? "s" : ""} on the LUMÉ mailing list.`}
      />

      <AdminTable
        columns={columns}
        data={newsletterSubscribers}
        emptyMessage="No newsletter subscribers yet."
      />
    </div>
  );
}

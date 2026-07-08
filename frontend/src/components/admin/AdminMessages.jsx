import { MessageSquare } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";

export default function AdminMessages() {
  const { contactMessages } = useAdminData();

  const columns = [
    {
      key: "sender",
      label: "Sender",
      render: (row) => (
        <div>
          <p className="font-medium text-ivory">{row.name || "—"}</p>
          <p className="text-xs text-smoke">{row.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (row) => (
        <span className="text-sm text-ivory">{row.subject || "—"}</span>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <p className="max-w-xs text-xs text-smoke line-clamp-2">{row.message}</p>
      ),
    },
    {
      key: "date",
      label: "Received",
      render: (row) => (
        <span className="text-xs text-smoke">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
  ];

  const unread = contactMessages.length;

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        eyebrow="Support"
        title="Contact Messages"
        description={
          unread > 0
            ? `${unread} message${unread !== 1 ? "s" : ""} received via the contact form.`
            : "No messages received yet."
        }
      />

      {contactMessages.length > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
          <MessageSquare size={15} className="text-gold shrink-0" />
          <p className="text-xs text-smoke">
            These are read-only enquiries submitted from the storefront Contact page. Reply directly to the sender's email address.
          </p>
        </div>
      )}

      <AdminTable
        columns={columns}
        data={contactMessages}
        emptyMessage="No contact messages received yet."
      />
    </div>
  );
}

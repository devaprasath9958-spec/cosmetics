import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";
import AdminBadge from "./ui/AdminBadge.jsx";
import AdminModal, {
  AdminField,
  adminInputClass,
  adminSelectClass,
  adminBtnPrimary,
  adminBtnOutline,
} from "./ui/AdminModal.jsx";

const TIERS = ["Active", "VIP"];

const emptyForm = { full_name: "", email: "", phone: "", status: "Active" };

export default function AdminCustomers() {
  const { customers, updateCustomer, deleteCustomer } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      full_name: customer.full_name || customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      status: customer.status || "Active",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCustomer(editingId, form);
    setModalOpen(false);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-ivory">{row.full_name || row.name || "—"}</p>
          <p className="text-xs text-smoke">{row.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => <span className="text-ivory">{row.phone || "—"}</span>,
    },
    {
      key: "joined",
      label: "Joined",
      render: (row) => (
        <span className="text-xs text-smoke">
          {row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : row.joined || "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Tier",
      render: (row) => <AdminBadge label={row.status || "Active"} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-gold hover:border-gold/30"
            aria-label={`Edit ${row.full_name || row.email}`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Remove profile for "${row.full_name || row.email}"? This cannot be undone.`))
                deleteCustomer(row.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
            aria-label={`Delete ${row.email}`}
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
        eyebrow="Community"
        title="Customers Management"
        description="View and manage registered customer profiles. Profiles are created automatically on signup."
      />

      <AdminTable columns={columns} data={customers} emptyMessage="No customer profiles found." />

      {modalOpen && (
        <AdminModal title="Edit Customer Profile" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Full Name">
              <input className={adminInputClass} value={form.full_name} onChange={set("full_name")} />
            </AdminField>
            <AdminField label="Email">
              <input type="email" className={adminInputClass} value={form.email} onChange={set("email")} />
            </AdminField>
            <AdminField label="Phone">
              <input className={adminInputClass} value={form.phone} onChange={set("phone")} />
            </AdminField>
            <AdminField label="Membership Tier">
              <select className={adminSelectClass} value={form.status} onChange={set("status")}>
                {TIERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </AdminField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                Save Changes
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

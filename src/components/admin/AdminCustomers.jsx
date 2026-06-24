import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";
import AdminBadge from "./ui/AdminBadge.jsx";
import AdminModal, { AdminField, adminInputClass, adminSelectClass, adminBtnPrimary, adminBtnOutline } from "./ui/AdminModal.jsx";

const STATUSES = ["Active", "VIP"];

const emptyForm = { name: "", email: "", phone: "", status: "Active", joined: "" };

export default function AdminCustomers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, joined: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) });
    setModalOpen(true);
  };

  const openEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      joined: customer.joined,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateCustomer(editingId, form);
    } else {
      addCustomer(form);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-ivory">{row.name}</p>
          <p className="text-xs text-smoke">{row.email}</p>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (row) => <span className="text-ivory">{row.phone}</span> },
    {
      key: "orders",
      label: "Orders",
      render: (row) => <span className="text-ivory">{row.orders}</span>,
    },
    {
      key: "spent",
      label: "Lifetime Spent",
      render: (row) => <span className="font-medium text-gold">${row.spent?.toFixed(2)}</span>,
    },
    {
      key: "status",
      label: "Tier",
      render: (row) => <AdminBadge label={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-gold hover:border-gold/30"
            aria-label={`Edit ${row.name}`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete customer "${row.name}"?`)) deleteCustomer(row.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
            aria-label={`Delete ${row.name}`}
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
        description="View and manage registered customer profiles and VIP tiers."
        action={
          <button onClick={openAdd} className={`${adminBtnPrimary} flex items-center gap-2`}>
            <Plus size={14} /> Add Customer
          </button>
        }
      />

      <AdminTable columns={columns} data={customers} emptyMessage="No customers on record." />

      {modalOpen && (
        <AdminModal title={editingId ? "Edit Customer" : "Add Customer"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Full Name">
              <input required className={adminInputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </AdminField>
            <AdminField label="Email">
              <input required type="email" className={adminInputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </AdminField>
            <AdminField label="Phone">
              <input required className={adminInputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </AdminField>
            <AdminField label="Membership Tier">
              <select className={adminSelectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </AdminField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                {editingId ? "Save Changes" : "Add Customer"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

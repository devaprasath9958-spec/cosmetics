import { useState } from "react";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";
import AdminModal, {
  AdminField,
  adminInputClass,
  adminBtnPrimary,
  adminBtnOutline,
} from "./ui/AdminModal.jsx";

const emptyForm = { name: "", logo_url: "" };

export default function AdminBrands() {
  const { brands, addBrand, updateBrand, deleteBrand } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (brand) => {
    setEditingId(brand.id);
    setForm({ name: brand.name || "", logo_url: brand.logo_url || "" });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name: form.name, logo_url: form.logo_url || null };
    if (editingId) updateBrand(editingId, payload);
    else addBrand(payload);
    setModalOpen(false);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const columns = [
    {
      key: "name",
      label: "Brand",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.logo_url ? (
            <img
              src={row.logo_url}
              alt={row.name}
              className="h-8 w-16 object-contain rounded border border-obsidian-border bg-obsidian/60 p-1 shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border bg-obsidian-soft/40 shrink-0">
              <Award size={14} className="text-smoke" />
            </div>
          )}
          <p className="font-medium text-ivory">{row.name}</p>
        </div>
      ),
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
              if (window.confirm(`Delete brand "${row.name}"?`)) deleteBrand(row.id);
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
        eyebrow="Partners"
        title="Brands Management"
        description="Manage featured brands displayed in the storefront brand strip."
        action={
          <button onClick={openAdd} className={`${adminBtnPrimary} flex items-center gap-2`}>
            <Plus size={14} /> Add Brand
          </button>
        }
      />

      <AdminTable columns={columns} data={brands} emptyMessage="No brands on record." />

      {modalOpen && (
        <AdminModal
          title={editingId ? "Edit Brand" : "Add Brand"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Brand Name">
              <input
                required
                className={adminInputClass}
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. La Mer"
              />
            </AdminField>
            <AdminField label="Logo URL (optional)">
              <input
                className={adminInputClass}
                value={form.logo_url}
                onChange={set("logo_url")}
                placeholder="https://..."
              />
            </AdminField>
            {form.logo_url && (
              <img
                src={form.logo_url}
                alt="Logo preview"
                className="h-12 object-contain rounded border border-obsidian-border p-2 bg-obsidian/40"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                {editingId ? "Save Changes" : "Add Brand"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

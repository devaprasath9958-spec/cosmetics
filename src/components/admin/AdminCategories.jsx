import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";
import AdminModal, {
  AdminField,
  adminInputClass,
  adminBtnPrimary,
  adminBtnOutline,
} from "./ui/AdminModal.jsx";

const emptyForm = { name: "", description: "", image_url: "" };

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      image_url: cat.image_url || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      image_url: form.image_url || null,
    };
    if (editingId) updateCategory(editingId, payload);
    else addCategory(payload);
    setModalOpen(false);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const columns = [
    {
      key: "name",
      label: "Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.name}
              className="h-10 w-10 rounded-lg object-cover border border-obsidian-border shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg border border-obsidian-border bg-obsidian-soft/40 shrink-0 flex items-center justify-center text-smoke text-xs">
              —
            </div>
          )}
          <div>
            <p className="font-medium text-ivory">{row.name}</p>
            {row.description && (
              <p className="text-xs text-smoke line-clamp-1">{row.description}</p>
            )}
          </div>
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
              if (window.confirm(`Delete category "${row.name}"?`)) deleteCategory(row.id);
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
        eyebrow="Catalog"
        title="Categories Management"
        description="Organise products into browsable categories shown on the storefront."
        action={
          <button onClick={openAdd} className={`${adminBtnPrimary} flex items-center gap-2`}>
            <Plus size={14} /> Add Category
          </button>
        }
      />

      <AdminTable columns={columns} data={categories} emptyMessage="No categories found. Add one to get started." />

      {modalOpen && (
        <AdminModal
          title={editingId ? "Edit Category" : "Add Category"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Category Name">
              <input
                required
                className={adminInputClass}
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Skincare"
              />
            </AdminField>
            <AdminField label="Description">
              <input
                className={adminInputClass}
                value={form.description}
                onChange={set("description")}
                placeholder="Short description shown on category card"
              />
            </AdminField>
            <AdminField label="Image URL">
              <input
                className={adminInputClass}
                value={form.image_url}
                onChange={set("image_url")}
                placeholder="https://images.unsplash.com/..."
              />
            </AdminField>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl border border-obsidian-border"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                {editingId ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

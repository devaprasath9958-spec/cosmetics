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

const emptyForm = {
  name: "",
  description: "",
  image_url: "",
  categories: "",
  badges: "",
  price_min: "",
  price_max: "",
};

export default function AdminCollections() {
  const { collections, addCollection, updateCollection, deleteCollection } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const parseToArray = (val) =>
    typeof val === "string"
      ? val.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(val)
      ? val
      : [];

  const arrayToString = (arr) =>
    Array.isArray(arr) ? arr.join(", ") : arr || "";

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (col) => {
    setEditingId(col.id);
    const pr = col.priceRange || col.price_range || {};
    setForm({
      name: col.name || "",
      description: col.description || "",
      image_url: col.image_url || "",
      categories: arrayToString(col.categories),
      badges: arrayToString(col.badges),
      price_min: pr.min != null ? String(pr.min) : "",
      price_max: pr.max != null ? String(pr.max) : "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      image_url: form.image_url || null,
      categories: JSON.stringify(parseToArray(form.categories)),
      badges: JSON.stringify(parseToArray(form.badges)),
      price_range: JSON.stringify({
        min: form.price_min ? parseFloat(form.price_min) : 0,
        max: form.price_max ? parseFloat(form.price_max) : 999,
      }),
    };
    if (editingId) updateCollection(editingId, payload);
    else addCollection(payload);
    setModalOpen(false);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const columns = [
    {
      key: "name",
      label: "Collection",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.name}
              className="h-10 w-16 rounded-lg object-cover border border-obsidian-border shrink-0"
            />
          ) : (
            <div className="h-10 w-16 rounded-lg border border-obsidian-border bg-obsidian-soft/40 shrink-0" />
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
      key: "categories",
      label: "Categories",
      render: (row) => {
        const cats = Array.isArray(row.categories) ? row.categories : [];
        return (
          <span className="text-xs text-smoke">
            {cats.length > 0 ? cats.join(", ") : "—"}
          </span>
        );
      },
    },
    {
      key: "price_range",
      label: "Price Range",
      render: (row) => {
        const pr = row.priceRange || row.price_range || {};
        return (
          <span className="text-xs text-ivory">
            {pr.min != null ? `$${pr.min} – $${pr.max}` : "—"}
          </span>
        );
      },
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
              if (window.confirm(`Delete collection "${row.name}"?`)) deleteCollection(row.id);
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
        eyebrow="Shop"
        title="Collections Management"
        description="Curate product collections displayed on the Collections shop page."
        action={
          <button onClick={openAdd} className={`${adminBtnPrimary} flex items-center gap-2`}>
            <Plus size={14} /> Add Collection
          </button>
        }
      />

      <AdminTable columns={columns} data={collections} emptyMessage="No collections found." />

      {modalOpen && (
        <AdminModal
          title={editingId ? "Edit Collection" : "Add Collection"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <AdminField label="Collection Name">
              <input
                required
                className={adminInputClass}
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Summer Glow Edit"
              />
            </AdminField>
            <AdminField label="Description">
              <textarea
                className={`${adminInputClass} resize-none`}
                rows={2}
                value={form.description}
                onChange={set("description")}
              />
            </AdminField>
            <AdminField label="Cover Image URL">
              <input
                className={adminInputClass}
                value={form.image_url}
                onChange={set("image_url")}
                placeholder="https://..."
              />
            </AdminField>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-28 object-cover rounded-xl border border-obsidian-border"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <AdminField label="Categories (comma-separated)">
              <input
                className={adminInputClass}
                value={form.categories}
                onChange={set("categories")}
                placeholder="Skincare, Makeup"
              />
            </AdminField>
            <AdminField label="Badges (comma-separated)">
              <input
                className={adminInputClass}
                value={form.badges}
                onChange={set("badges")}
                placeholder="New, Bestseller"
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Min Price ($)">
                <input type="number" min="0" step="0.01" className={adminInputClass} value={form.price_min} onChange={set("price_min")} />
              </AdminField>
              <AdminField label="Max Price ($)">
                <input type="number" min="0" step="0.01" className={adminInputClass} value={form.price_max} onChange={set("price_max")} />
              </AdminField>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                {editingId ? "Save Changes" : "Add Collection"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

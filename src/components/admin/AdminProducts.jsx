import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext.jsx";
import AdminPageHeader from "./ui/AdminPageHeader.jsx";
import AdminTable from "./ui/AdminTable.jsx";
import AdminBadge from "./ui/AdminBadge.jsx";
import AdminModal, { AdminField, adminInputClass, adminSelectClass, adminBtnPrimary, adminBtnOutline } from "./ui/AdminModal.jsx";
import BottleIllustration from "../ui/BottleIllustration.jsx";

const CATEGORIES = ["Skincare", "Makeup", "Fragrance", "Hair Care"];
const BADGES = ["", "Bestseller", "New", "Sale", "Limited"];
const BOTTLES = ["bottle", "jar", "tube"];

const emptyForm = {
  name: "",
  subtitle: "",
  category: "Skincare",
  price: "",
  oldPrice: "",
  rating: "4.5",
  reviews: "0",
  badge: "",
  bottle: "bottle",
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      rating: String(product.rating),
      reviews: String(product.reviews),
      badge: product.badge || "",
      bottle: product.bottle || "bottle",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      subtitle: form.subtitle,
      category: form.category,
      price: parseFloat(form.price) || 0,
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      rating: parseFloat(form.rating) || 0,
      reviews: parseInt(form.reviews, 10) || 0,
      badge: form.badge || null,
      bottle: form.bottle,
      colors: ["#C9A769", "#8B3A4B"],
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-obsidian border border-obsidian-border p-1.5">
            <BottleIllustration variant={row.bottle} from={row.colors?.[0]} to={row.colors?.[1]} className="h-9 w-auto" />
          </div>
          <div>
            <p className="font-medium text-ivory">{row.name}</p>
            <p className="text-xs text-smoke">{row.subtitle}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (row) => <span className="text-ivory">{row.category}</span> },
    {
      key: "price",
      label: "Price",
      render: (row) => <span className="font-medium text-gold">${row.price}</span>,
    },
    {
      key: "badge",
      label: "Status",
      render: (row) => <AdminBadge label={row.badge} />,
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
              if (window.confirm(`Delete "${row.name}"?`)) deleteProduct(row.id);
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
        title="Products Management"
        description="Add, edit, or remove products from the LUMÉ catalog."
        action={
          <button onClick={openAdd} className={`${adminBtnPrimary} flex items-center gap-2`}>
            <Plus size={14} /> Add Product
          </button>
        }
      />

      <AdminTable columns={columns} data={products} emptyMessage="No products in catalog." />

      {modalOpen && (
        <AdminModal title={editingId ? "Edit Product" : "Add Product"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Product Name">
              <input required className={adminInputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </AdminField>
            <AdminField label="Subtitle">
              <input required className={adminInputClass} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </AdminField>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Category">
                <select className={adminSelectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Bottle Type">
                <select className={adminSelectClass} value={form.bottle} onChange={(e) => setForm({ ...form, bottle: e.target.value })}>
                  {BOTTLES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </AdminField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Price ($)">
                <input required type="number" min="0" step="0.01" className={adminInputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </AdminField>
              <AdminField label="Old Price ($)">
                <input type="number" min="0" step="0.01" className={adminInputClass} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
              </AdminField>
            </div>
            <AdminField label="Badge">
              <select className={adminSelectClass} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b}>{b || "None"}</option>
                ))}
              </select>
            </AdminField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                {editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, AlertTriangle, RotateCcw } from "lucide-react";
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
import BottleIllustration from "../ui/BottleIllustration.jsx";

const CATEGORIES = ["Skincare", "Makeup", "Fragrance", "Hair Care"];
const BADGES = ["", "Bestseller", "New", "Sale", "Limited"];
const BOTTLES = ["bottle", "jar", "tube"];

const emptyForm = {
  name: "",
  subtitle: "",
  description: "",
  brand: "LUMÉ",
  category: "Skincare",
  price: "",
  old_price: "",
  stock: "100",
  rating: "4.5",
  reviews: "0",
  badge: "",
  bottle: "bottle",
  image: "",
  tags: "",
  color1: "#C9A769",
  color2: "#8B3A4B",
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
  const [undoData, setUndoData] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    const colors = product.colors || ["#C9A769", "#8B3A4B"];
    setForm({
      name: product.name || "",
      subtitle: product.subtitle || "",
      description: product.description || "",
      brand: product.brand || "LUMÉ",
      category: product.category || "Skincare",
      price: String(product.price || ""),
      old_price: product.old_price != null ? String(product.old_price) : product.oldPrice != null ? String(product.oldPrice) : "",
      stock: String(product.stock ?? 100),
      rating: String(product.rating || "4.5"),
      reviews: String(product.reviews || "0"),
      badge: product.badge || "",
      bottle: product.bottle || "bottle",
      image: product.image || product.image_url || "",
      tags: typeof product.tags === "string" ? product.tags : JSON.stringify(product.tags || []),
      color1: colors[0] || "#C9A769",
      color2: colors[1] || "#8B3A4B",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return showToast("Product name is required.", "error");
    if (parseFloat(form.price) < 0 || isNaN(parseFloat(form.price))) return showToast("Invalid price.", "error");
    
    // Parse tags back to array if it looks like JSON or comma separated
    let parsedTags = [];
    try {
      parsedTags = form.tags.startsWith("[") ? JSON.parse(form.tags) : form.tags.split(",").map(t => t.trim()).filter(Boolean);
    } catch {
      parsedTags = [form.tags];
    }

    const payload = {
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: parseFloat(form.price) || 0,
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      stock: parseInt(form.stock, 10) || 0,
      rating: parseFloat(form.rating) || 0,
      reviews: parseInt(form.reviews, 10) || 0,
      badge: form.badge || null,
      bottle: form.bottle,
      image: form.image || null,
      tags: JSON.stringify(parsedTags),
      colors: JSON.stringify([form.color1, form.color2]),
    };

    try {
      if (editingId) {
        const originalProduct = products.find(p => p.id === editingId);
        await updateProduct(editingId, payload);
        setUndoData({ type: "edit", id: editingId, original: originalProduct });
        showToast("Product updated successfully.");
      } else {
        await addProduct(payload);
        showToast("Product created successfully.");
      }
      setModalOpen(false);
    } catch (err) {
      showToast("Failed to save product.", "error");
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Delete "${row.name}"?`)) {
      try {
        await deleteProduct(row.id);
        setUndoData({ type: "delete", id: row.id, original: row });
        showToast("Product deleted.");
      } catch (err) {
        showToast("Failed to delete product.", "error");
      }
    }
  };

  const handleUndo = async () => {
    if (!undoData) return;
    try {
      if (undoData.type === "delete") {
        await addProduct(undoData.original);
        showToast("Deletion undone.");
      } else if (undoData.type === "edit") {
        await updateProduct(undoData.id, undoData.original);
        showToast("Edits reverted.");
      }
      setUndoData(null);
    } catch (err) {
      showToast("Failed to undo action.", "error");
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-obsidian border border-obsidian-border p-1.5 shrink-0 overflow-hidden">
            {row.image ? (
              <img src={row.image} alt={row.name} className="h-full w-full object-cover rounded" />
            ) : (
              <BottleIllustration
                variant={row.bottle}
                from={row.colors?.[0]}
                to={row.colors?.[1]}
                className="h-9 w-auto"
              />
            )}
          </div>
          <div>
            <p className="font-medium text-ivory">{row.name}</p>
            <p className="text-xs text-smoke">{row.subtitle}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => <span className="text-ivory">{row.category}</span>,
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <div>
          <span className="font-medium text-gold">${row.price}</span>
          {(row.old_price || row.oldPrice) && (
            <span className="ml-2 text-xs text-smoke line-through">${row.old_price ?? row.oldPrice}</span>
          )}
        </div>
      ),
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
            onClick={() => handleDelete(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30 transition-colors"
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

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl ${
          toast.type === "error" ? "bg-rose-deep/90 border border-rose/50 text-white" : "bg-obsidian border border-gold/30 text-ivory"
        }`}>
          {toast.type === "error" ? <AlertTriangle size={16} className="text-rose-light" /> : <Check size={16} className="text-gold" />}
          <span className="text-sm font-medium">{toast.message}</span>
          {undoData && toast.type !== "error" && (
            <button onClick={handleUndo} className="ml-4 flex items-center gap-1.5 rounded-lg bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold hover:bg-gold/20 transition-colors">
              <RotateCcw size={12} /> Undo
            </button>
          )}
        </div>
      )}

      {modalOpen && (
        <AdminModal
          title={editingId ? "Edit Product" : "Add Product"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminField label="Product Name">
                <input required className={adminInputClass} value={form.name} onChange={set("name")} placeholder="Dew Drop Serum" />
              </AdminField>
              <AdminField label="Brand">
                <input required className={adminInputClass} value={form.brand} onChange={set("brand")} placeholder="LUMÉ" />
              </AdminField>
            </div>
            <AdminField label="Subtitle">
              <input required className={adminInputClass} value={form.subtitle} onChange={set("subtitle")} placeholder="Hyaluronic + Vitamin C" />
            </AdminField>
            <AdminField label="Full Description">
              <textarea className={adminInputClass} value={form.description} onChange={set("description")} rows={3} placeholder="Detailed description of the product benefits..." />
            </AdminField>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Category">
                <select className={adminSelectClass} value={form.category} onChange={set("category")}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Bottle Type">
                <select className={adminSelectClass} value={form.bottle} onChange={set("bottle")}>
                  {BOTTLES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </AdminField>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <AdminField label="Price ($)">
                <input required type="number" min="0" step="0.01" className={adminInputClass} value={form.price} onChange={set("price")} />
              </AdminField>
              <AdminField label="Old Price ($)">
                <input type="number" min="0" step="0.01" className={adminInputClass} value={form.old_price} onChange={set("old_price")} placeholder="Discount price" />
              </AdminField>
              <AdminField label="Stock">
                <input required type="number" min="0" className={adminInputClass} value={form.stock} onChange={set("stock")} />
              </AdminField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Rating">
                <input type="number" min="0" max="5" step="0.1" className={adminInputClass} value={form.rating} onChange={set("rating")} />
              </AdminField>
              <AdminField label="Review Count">
                <input type="number" min="0" className={adminInputClass} value={form.reviews} onChange={set("reviews")} />
              </AdminField>
            </div>
            <AdminField label="Badge">
              <select className={adminSelectClass} value={form.badge} onChange={set("badge")}>
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b}>{b || "None"}</option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Tags (comma separated)">
              <input className={adminInputClass} value={form.tags} onChange={set("tags")} placeholder="vegan, cruelty-free, hydrating" />
            </AdminField>
            <AdminField label="Image URL">
              <input className={adminInputClass} value={form.image} onChange={set("image")} placeholder="https://images.unsplash.com/..." />
            </AdminField>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Colour 1 (Hex)">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.color1} onChange={set("color1")} className="h-10 w-10 rounded-lg border border-obsidian-border bg-transparent cursor-pointer" />
                  <input className={adminInputClass} value={form.color1} onChange={set("color1")} maxLength={7} />
                </div>
              </AdminField>
              <AdminField label="Colour 2 (Hex)">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.color2} onChange={set("color2")} className="h-10 w-10 rounded-lg border border-obsidian-border bg-transparent cursor-pointer" />
                  <input className={adminInputClass} value={form.color2} onChange={set("color2")} maxLength={7} />
                </div>
              </AdminField>
            </div>
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

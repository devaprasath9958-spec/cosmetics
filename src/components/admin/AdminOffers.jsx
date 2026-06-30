import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

const ACCENT_OPTIONS = ["gold", "rose"];
const TYPE_OPTIONS = ["percentage", "gift", "other"];

const emptyForm = {
  title: "",
  description: "",
  linkText: "",
  accent: "gold",
  type: "percentage",
};

export default function AdminOffers() {
  const { offers, addOffer, updateOffer, deleteOffer } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (offer) => {
    setEditingId(offer.id);
    setForm({
      title: offer.title || "",
      description: offer.description || "",
      linkText: offer.linkText || offer.link_text || "",
      accent: offer.accent || "gold",
      type: offer.type || "percentage",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      linkText: form.linkText,
      accent: form.accent,
      type: form.type,
    };
    if (editingId) updateOffer(editingId, payload);
    else addOffer(payload);
    setModalOpen(false);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const columns = [
    {
      key: "title",
      label: "Offer",
      render: (row) => (
        <div>
          <p className="font-medium text-ivory">{row.title}</p>
          <p className="text-xs text-smoke line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      key: "accent",
      label: "Style",
      render: (row) => <AdminBadge label={row.accent === "gold" ? "Bestseller" : "Sale"} />,
    },
    {
      key: "type",
      label: "Type",
      render: (row) => <span className="text-xs text-smoke capitalize">{row.type}</span>,
    },
    {
      key: "linkText",
      label: "CTA",
      render: (row) => <span className="text-xs text-ivory">{row.linkText || row.link_text || "—"}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-gold hover:border-gold/30"
            aria-label={`Edit offer`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete offer "${row.title}"?`)) deleteOffer(row.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
            aria-label={`Delete offer`}
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
        eyebrow="Promotions"
        title="Offers Management"
        description="Create and manage promotional offer cards shown on the home page."
        action={
          <button onClick={openAdd} className={`${adminBtnPrimary} flex items-center gap-2`}>
            <Plus size={14} /> Add Offer
          </button>
        }
      />

      <AdminTable columns={columns} data={offers} emptyMessage="No offers configured." />

      {modalOpen && (
        <AdminModal
          title={editingId ? "Edit Offer" : "Add Offer"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Title">
              <input
                required
                className={adminInputClass}
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. 20% off your first order"
              />
            </AdminField>
            <AdminField label="Description">
              <textarea
                className={`${adminInputClass} resize-none`}
                rows={3}
                value={form.description}
                onChange={set("description")}
                placeholder="Short offer description shown on the card"
              />
            </AdminField>
            <AdminField label="CTA Button Text">
              <input
                className={adminInputClass}
                value={form.linkText}
                onChange={set("linkText")}
                placeholder="e.g. Shop Now"
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Accent Colour">
                <select className={adminSelectClass} value={form.accent} onChange={set("accent")}>
                  {ACCENT_OPTIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Icon Type">
                <select className={adminSelectClass} value={form.type} onChange={set("type")}>
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </AdminField>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                {editingId ? "Save Changes" : "Add Offer"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

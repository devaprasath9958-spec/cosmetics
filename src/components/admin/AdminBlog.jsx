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

const BLOG_CATEGORIES = ["Skincare", "Makeup", "Lifestyle", "Ingredients", "Tutorials", "News"];

const emptyForm = {
  title: "",
  excerpt: "",
  category: "Skincare",
  author: "",
  image_url: "",
  read_time: "5",
  content: "",
};

export default function AdminBlog() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      category: post.category || "Skincare",
      author: post.author || "",
      image_url: post.image_url || "",
      read_time: String(post.read_time || "5"),
      content: post.content || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      category: form.category,
      author: form.author,
      image_url: form.image_url || null,
      read_time: parseInt(form.read_time, 10) || 5,
      content: form.content || null,
    };
    if (editingId) updateBlogPost(editingId, payload);
    else addBlogPost(payload);
    setModalOpen(false);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const columns = [
    {
      key: "title",
      label: "Post",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.title}
              className="h-10 w-16 rounded-lg object-cover border border-obsidian-border shrink-0"
            />
          ) : (
            <div className="h-10 w-16 rounded-lg border border-obsidian-border bg-obsidian-soft/40 shrink-0" />
          )}
          <div>
            <p className="font-medium text-ivory line-clamp-1">{row.title}</p>
            <p className="text-xs text-smoke line-clamp-1">{row.excerpt}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => <AdminBadge label={row.category === "New" ? "New" : undefined} className="hidden" />,
    },
    {
      key: "cat_label",
      label: "Category",
      render: (row) => <span className="text-xs text-smoke">{row.category}</span>,
    },
    {
      key: "author",
      label: "Author",
      render: (row) => <span className="text-xs text-ivory">{row.author || "—"}</span>,
    },
    {
      key: "read_time",
      label: "Read",
      render: (row) => (
        <span className="text-xs text-smoke">{row.read_time ? `${row.read_time} min` : "—"}</span>
      ),
    },
    {
      key: "date",
      label: "Published",
      render: (row) => (
        <span className="text-xs text-smoke">
          {row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
        </span>
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
            aria-label={`Edit ${row.title}`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete post "${row.title}"?`)) deleteBlogPost(row.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-obsidian-border text-smoke hover:text-rose hover:border-rose/30"
            aria-label={`Delete ${row.title}`}
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
        eyebrow="Content"
        title="Blog Management"
        description="Write and manage blog posts published on the LUMÉ journal."
        action={
          <button onClick={openAdd} className={`${adminBtnPrimary} flex items-center gap-2`}>
            <Plus size={14} /> New Post
          </button>
        }
      />

      <AdminTable columns={columns} data={blogPosts} emptyMessage="No blog posts found." />

      {modalOpen && (
        <AdminModal
          title={editingId ? "Edit Blog Post" : "New Blog Post"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <AdminField label="Title">
              <input
                required
                className={adminInputClass}
                value={form.title}
                onChange={set("title")}
                placeholder="Post title"
              />
            </AdminField>
            <AdminField label="Excerpt">
              <textarea
                className={`${adminInputClass} resize-none`}
                rows={2}
                value={form.excerpt}
                onChange={set("excerpt")}
                placeholder="Short description shown in blog listing"
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Category">
                <select className={adminSelectClass} value={form.category} onChange={set("category")}>
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Read Time (min)">
                <input
                  type="number"
                  min="1"
                  className={adminInputClass}
                  value={form.read_time}
                  onChange={set("read_time")}
                />
              </AdminField>
            </div>
            <AdminField label="Author">
              <input
                className={adminInputClass}
                value={form.author}
                onChange={set("author")}
                placeholder="e.g. LUMÉ Editorial"
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
            <AdminField label="Content (optional)">
              <textarea
                className={`${adminInputClass} resize-none`}
                rows={5}
                value={form.content}
                onChange={set("content")}
                placeholder="Full article body (Markdown or plain text)"
              />
            </AdminField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 ${adminBtnOutline}`}>
                Cancel
              </button>
              <button type="submit" className={`flex-1 ${adminBtnPrimary}`}>
                {editingId ? "Save Changes" : "Publish Post"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

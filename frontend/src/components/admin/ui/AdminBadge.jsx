const styles = {
  Approved: "bg-gold/15 text-gold border-gold/30",
  Pending: "bg-rose-deep/20 text-rose border-rose/30",
  Rejected: "bg-obsidian-border text-smoke border-obsidian-border",
  Active: "bg-ivory/10 text-ivory border-ivory/20",
  VIP: "bg-gold/15 text-gold border-gold/30",
  Processing: "bg-gold/15 text-gold border-gold/30",
  "In Transit": "bg-rose-deep/20 text-rose border-rose/30",
  Delivered: "bg-ivory/10 text-ivory border-ivory/20",
  Cancelled: "bg-obsidian-border text-smoke border-obsidian-border",
  Bestseller: "bg-gold/15 text-gold border-gold/30",
  Sale: "bg-rose-deep/20 text-rose border-rose/30",
  New: "bg-ivory/10 text-ivory border-ivory/20",
  Limited: "bg-rose-deep/20 text-rose border-rose/30",
};

export default function AdminBadge({ label, className = "" }) {
  if (!label) return null;
  const style = styles[label] || "bg-obsidian-soft text-smoke border-obsidian-border";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style} ${className}`}
    >
      {label}
    </span>
  );
}

export default function AdminStatCard({ label, value, icon: Icon, description }) {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-obsidian-border bg-obsidian-light/60 p-6">
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-smoke/70">{label}</span>
        <div className="font-display text-2xl text-ivory font-medium">{value}</div>
        {description && <p className="text-[11px] text-smoke/80">{description}</p>}
      </div>
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian-soft border border-obsidian-border text-gold/70">
          <Icon size={18} />
        </div>
      )}
    </div>
  );
}

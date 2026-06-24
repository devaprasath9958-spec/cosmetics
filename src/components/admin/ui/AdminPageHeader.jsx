export default function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-obsidian-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest2 text-gold">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl text-ivory">{title}</h1>
        {description && <p className="mt-2 text-sm text-smoke max-w-xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

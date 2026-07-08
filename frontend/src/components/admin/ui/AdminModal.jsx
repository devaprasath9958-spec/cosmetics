import { X } from "lucide-react";

export default function AdminModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-obsidian-border bg-obsidian-light p-6 shadow-card animate-fade-up">
        <div className="mb-5 flex items-center justify-between border-b border-obsidian-border pb-4">
          <h2 className="font-display text-xl text-ivory">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-smoke hover:bg-obsidian-soft hover:text-ivory"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-wider text-gold font-medium">{label}</label>
      {children}
    </div>
  );
}

export const adminInputClass =
  "w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold/50";

export const adminSelectClass =
  "w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold/50";

export const adminBtnPrimary =
  "rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-obsidian hover:bg-gold-light transition-colors";

export const adminBtnOutline =
  "rounded-full border border-obsidian-border px-5 py-2.5 text-xs font-semibold text-smoke hover:border-gold/30 hover:text-gold transition-colors";

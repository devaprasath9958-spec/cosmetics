export default function Button({
  children,
  variant = "primary",
  className = "",
  as = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gold text-obsidian hover:bg-gold-light hover:shadow-glow active:scale-[0.98]",
    outline:
      "border border-obsidian-border text-ivory hover:border-gold hover:text-gold active:scale-[0.98]",
    ghost: "text-ivory hover:text-gold",
  };

  const Tag = as;

  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

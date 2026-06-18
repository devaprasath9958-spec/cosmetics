export default function ShadeSwatch({
  color = "#C9A769",
  size = "md",
  ring = false,
  className = "",
}) {
  const sizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
    xl: "w-10 h-10",
  };

  return (
    <span
      className={`inline-block rounded-full shrink-0 ${sizes[size]} ${
        ring ? "ring-2 ring-offset-2 ring-offset-obsidian ring-gold/30" : ""
      } ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

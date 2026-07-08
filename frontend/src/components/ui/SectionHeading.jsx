export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}) {
  return (
    <div
      className={`max-w-2xl ${
        align === "center" ? "mx-auto text-center" : ""
      } ${className}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl text-ivory text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-smoke leading-relaxed">{description}</p>
      )}
    </div>
  );
}

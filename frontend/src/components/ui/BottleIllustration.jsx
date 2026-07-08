// Hand-drawn product silhouettes rendered as SVG so the storefront never
// depends on external photography. Pass brand-palette colors as props.

export default function BottleIllustration({
  variant = "bottle",
  from = "#C9A769",
  to = "#8B3A4B",
  className = "",
}) {
  const gradId = `grad-${variant}-${from.slice(1)}-${to.slice(1)}`;

  if (variant === "jar") {
    return (
      <svg
        viewBox="0 0 200 240"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <rect x="30" y="70" width="140" height="150" rx="28" fill={`url(#${gradId})`} opacity="0.92" />
        <rect x="30" y="70" width="140" height="150" rx="28" stroke="#F3ECE2" strokeOpacity="0.12" />
        <rect x="42" y="28" width="116" height="50" rx="16" fill="#1F1922" stroke={from} strokeOpacity="0.45" />
        <ellipse cx="100" cy="102" rx="56" ry="14" fill="#FFFFFF" opacity="0.08" />
      </svg>
    );
  }

  if (variant === "tube") {
    return (
      <svg
        viewBox="0 0 200 240"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <path
          d="M70 18 H130 V66 L152 108 V196 Q152 218 130 218 H70 Q48 218 48 196 V108 L70 66 Z"
          fill={`url(#${gradId})`}
          opacity="0.94"
        />
        <rect x="70" y="18" width="60" height="22" rx="6" fill="#1F1922" />
        <ellipse cx="100" cy="118" rx="42" ry="10" fill="#FFFFFF" opacity="0.08" />
      </svg>
    );
  }

  // default: bottle
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="55" y="90" width="90" height="130" rx="18" fill={`url(#${gradId})`} opacity="0.94" />
      <rect x="80" y="40" width="40" height="55" rx="6" fill={`url(#${gradId})`} opacity="0.7" />
      <rect x="72" y="18" width="56" height="26" rx="8" fill="#1F1922" stroke={from} strokeOpacity="0.45" />
      <ellipse cx="100" cy="132" rx="36" ry="9" fill="#FFFFFF" opacity="0.08" />
    </svg>
  );
}

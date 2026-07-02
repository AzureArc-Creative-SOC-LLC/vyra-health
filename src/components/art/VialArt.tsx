interface VialArtProps {
  /** brand accent colour for the liquid */
  accent?: string;
  size?: number;
  className?: string;
}

/** Original illustration of a treatment vial — used as a product image
    placeholder so no third-party photography is needed. */
export default function VialArt({
  accent = "#f4866e",
  size = 200,
  className,
}: VialArtProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Treatment vial illustration"
    >
      <defs>
        <linearGradient id={`liquid-${accent}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.78" />
          <stop offset="1" stopColor={accent} />
        </linearGradient>
        <radialGradient id="vial-bg" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fcf5f3" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="96" fill="url(#vial-bg)" />
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="none"
        stroke={accent}
        strokeOpacity="0.18"
        strokeWidth="2"
      />

      {/* soft accent halo */}
      <circle cx="100" cy="104" r="58" fill={accent} opacity="0.08" />

      {/* vial body */}
      <rect x="74" y="64" width="52" height="96" rx="14" fill="#ffffff" />
      <rect
        x="74"
        y="64"
        width="52"
        height="96"
        rx="14"
        fill="none"
        stroke="#f0e1dd"
        strokeWidth="2"
      />
      {/* liquid fill */}
      <path
        d="M74 104c0-2 1-3 3-3h46c2 0 3 1 3 3v42a14 14 0 0 1-14 14H88a14 14 0 0 1-14-14Z"
        fill={`url(#liquid-${accent})`}
      />
      {/* meniscus shine */}
      <ellipse cx="100" cy="103" rx="24" ry="4" fill="#ffffff" opacity="0.55" />
      {/* glass highlight */}
      <rect
        x="82"
        y="74"
        width="7"
        height="74"
        rx="3.5"
        fill="#ffffff"
        opacity="0.7"
      />

      {/* cap */}
      <rect x="84" y="42" width="32" height="16" rx="4" fill={accent} />
      <rect x="88" y="34" width="24" height="12" rx="3" fill="#d8dae6" />
      <rect x="88" y="34" width="24" height="12" rx="3" fill="none" stroke="#aeb2c4" strokeWidth="1.5" />

      {/* label */}
      <rect x="80" y="116" width="40" height="30" rx="4" fill="#ffffff" opacity="0.92" />
      <rect x="86" y="123" width="28" height="3.4" rx="1.7" fill={accent} opacity="0.85" />
      <rect x="86" y="130" width="20" height="3" rx="1.5" fill={accent} opacity="0.4" />
      <rect x="86" y="136" width="24" height="3" rx="1.5" fill={accent} opacity="0.4" />
    </svg>
  );
}

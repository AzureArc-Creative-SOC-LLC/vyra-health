interface BoxArtProps {
  size?: number;
  className?: string;
  /** subtle accent tint for the cap sticker */
  accent?: string;
}

/** Original illustration of a white treatment box — product image
    placeholder so no third-party photography is used. */
export default function BoxArt({
  size = 240,
  className,
  accent = "#f4866e",
}: BoxArtProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="Vyra Health treatment box"
    >
      <defs>
        <linearGradient id="box-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#efe9da" />
        </linearGradient>
        <linearGradient id="box-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4efe2" />
          <stop offset="1" stopColor="#dcd4be" />
        </linearGradient>
        <linearGradient id="box-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e6dfcc" />
          <stop offset="1" stopColor="#cfc6ad" />
        </linearGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="120" cy="196" rx="86" ry="18" fill="rgba(40,38,30,0.12)" />

      {/* box — simple 2-point projection */}
      <polygon points="120,48 206,86 120,124 34,86" fill="url(#box-top)" />
      <polygon points="34,86 120,124 120,200 34,162" fill="url(#box-front)" />
      <polygon points="206,86 120,124 120,200 206,162" fill="url(#box-side)" />

      {/* edge highlights */}
      <polyline
        points="120,48 206,86 120,124 34,86 120,48"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
      />
      <line x1="120" y1="124" x2="120" y2="200" stroke="rgba(40,38,30,0.1)" strokeWidth="1.5" />

      {/* wordmark on the lid */}
      <text
        x="120"
        y="92"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="800"
        letterSpacing="3"
        fill="#181d4e"
        transform="rotate(24 120 88)"
        opacity="0.9"
      >
        VYRA
      </text>

      {/* cap sticker on the front */}
      <rect x="58" y="150" width="38" height="16" rx="3" fill={accent} opacity="0.9" />
      <rect x="64" y="170" width="26" height="5" rx="2.5" fill="rgba(40,38,30,0.18)" />
    </svg>
  );
}

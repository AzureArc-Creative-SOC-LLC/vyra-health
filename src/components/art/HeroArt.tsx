/** Original composed hero illustration: a calm "card stack" showing a
    treatment vial, a clinician chat note and a downward progress curve. */
export default function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 440"
      className={className}
      role="img"
      aria-label="Illustration of a Vyra Health treatment plan"
    >
      <defs>
        <linearGradient id="hero-disc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdeae6" />
          <stop offset="1" stopColor="#fbdcd5" />
        </linearGradient>
        <linearGradient id="hero-vial" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4866e" />
          <stop offset="1" stopColor="#181d4e" />
        </linearGradient>
        <filter id="hero-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="18"
            floodColor="#181d4e"
            floodOpacity="0.18"
          />
        </filter>
      </defs>

      {/* backdrop disc */}
      <circle cx="230" cy="220" r="200" fill="url(#hero-disc)" />
      <circle
        cx="230"
        cy="220"
        r="199"
        fill="none"
        stroke="#f4866e"
        strokeOpacity="0.25"
        strokeDasharray="2 9"
        strokeWidth="2"
      />

      {/* progress card */}
      <g filter="url(#hero-shadow)">
        <rect x="44" y="56" width="216" height="150" rx="20" fill="#ffffff" />
      </g>
      <text x="68" y="92" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#6b7076">
        Your progress
      </text>
      <text x="68" y="124" fontFamily="Fraunces, serif" fontSize="30" fontWeight="600" fill="#181d4e">
        −16.4%
      </text>
      {/* curve */}
      <path
        d="M70 178c26-2 40-20 64-30s44 6 70-14"
        fill="none"
        stroke="#181d4e"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="204" cy="134" r="5" fill="#181d4e" />
      <circle cx="204" cy="134" r="9" fill="#181d4e" fillOpacity="0.2" />

      {/* clinician chat card */}
      <g filter="url(#hero-shadow)">
        <rect x="250" y="250" width="200" height="120" rx="20" fill="#ffffff" />
      </g>
      <circle cx="284" cy="288" r="18" fill="#181d4e" />
      <path
        d="M276 288c0-2 1-3 3-3h10c2 0 3 1 3 3v5c0 2-1 3-3 3h-7l-4 3v-3c-1 0-2-1-2-3Z"
        fill="#fbdcd5"
      />
      <rect x="314" y="276" width="108" height="9" rx="4.5" fill="#fdeae6" />
      <rect x="314" y="292" width="84" height="9" rx="4.5" fill="#fdeae6" />
      <rect x="278" y="324" width="144" height="9" rx="4.5" fill="#fcf5f3" />
      <rect x="278" y="340" width="96" height="9" rx="4.5" fill="#fcf5f3" />

      {/* central vial */}
      <g filter="url(#hero-shadow)" transform="rotate(-10 300 150)">
        <rect x="278" y="78" width="58" height="118" rx="16" fill="#ffffff" />
        <path
          d="M278 128c0-2 1-3 3-3h52c2 0 3 1 3 3v52a16 16 0 0 1-16 16h-26a16 16 0 0 1-16-16Z"
          fill="url(#hero-vial)"
        />
        <rect x="286" y="88" width="8" height="92" rx="4" fill="#ffffff" opacity="0.7" />
        <rect x="294" y="56" width="26" height="16" rx="4" fill="#181d4e" />
        <ellipse cx="307" cy="127" rx="26" ry="4" fill="#ffffff" opacity="0.5" />
      </g>

      {/* floating leaves + sparkle */}
      <path
        d="M96 250c-22 0-32 12-32 32 22 0 32-12 32-32Z"
        fill="#f4866e"
        opacity="0.85"
      />
      <path d="M74 276c8-8 14-10 18-12" stroke="#181d4e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path
        d="M398 92c1.6 8 2.8 9.2 11 11-8.2 1.8-9.4 3-11 11-1.6-8-2.8-9.2-11-11 8.2-1.8 9.4-3 11-11Z"
        fill="#f4866e"
      />
      <circle cx="120" cy="360" r="10" fill="#ffffff" />
      <circle cx="120" cy="360" r="10" fill="#181d4e" fillOpacity="0.15" />
    </svg>
  );
}

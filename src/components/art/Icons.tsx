/* Inline SVG icon set — original line icons, 24x24 grid, stroke-based.
   Pass a `size` and inherit `color` via currentColor. */

interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconStethoscope = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M5 3v5a4 4 0 0 0 8 0V3" />
    <path d="M9 16v1a5 5 0 0 0 10 0v-2" />
    <circle cx="19" cy="12" r="2.4" />
  </svg>
);

export const IconShield = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconTag = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3 12V4h8l9 9-7 7-9-9Z" />
    <circle cx="7.5" cy="7.5" r="1.4" />
  </svg>
);

export const IconChat = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 5h16v11H9l-5 4V5Z" />
    <path d="M8.5 10.5h7M8.5 13h4" />
  </svg>
);

export const IconTruck = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const IconFlask = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
    <path d="M7.5 15h9" />
  </svg>
);

export const IconLeaf = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M20 4C9 4 4 10 4 20c10 0 16-5 16-16Z" />
    <path d="M9 15c3-3 6-4 8-5" />
  </svg>
);

export const IconStar = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.9 6.1 20.3l1.3-6.5L2.5 9.3l6.6-.8L12 2.5Z" />
  </svg>
);

export const IconCheck = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 12.5l5 5L20 6" />
  </svg>
);

export const IconArrow = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const IconCart = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3 4h2l2.5 12h10L20 7H6" />
    <circle cx="9" cy="20" r="1.6" />
    <circle cx="17" cy="20" r="1.6" />
  </svg>
);

export const IconUser = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

export const IconClock = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IconHeart = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 20S4 14.5 4 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8 2.8C20 14.5 12 20 12 20Z" />
  </svg>
);

export const IconLock = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconSparkle = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 3c.8 4.5 1.5 5.2 6 6-4.5.8-5.2 1.5-6 6-.8-4.5-1.5-5.2-6-6 4.5-.8 5.2-1.5 6-6Z" />
  </svg>
);

import "./ImagePlaceholder.css";

type Motif =
  | "portrait"
  | "phone"
  | "desk"
  | "door"
  | "package"
  | "person"
  | "abstract";

interface ImagePlaceholderProps {
  motif?: Motif;
  /** CSS aspect-ratio, e.g. "4 / 5" */
  ratio?: string;
  /** corner rounding */
  radius?: string;
  className?: string;
  /** small caption shown bottom-left; omit to hide */
  label?: string;
}

/* Warm abstract placeholder art. The real Vyra Health site uses photography;
   these are swappable stand-ins so no third-party images are copied.
   Replace a usage with <img src="/your-photo.jpg" /> when you have one. */

/* tones drawn from the soft accent palette (sage / rose / lavender /
   sand / cream) so placeholders stay cohesive with the theme */
const TONES: Record<Motif, [string, string]> = {
  portrait: ["#fdeae6", "#f9c9bd"],
  phone: ["#fbe2dc", "#f4a594"],
  desk: ["#e7e9f3", "#c3c8e0"],
  door: ["#fcf5f3", "#f9c9bd"],
  package: ["#fdeae6", "#f3d2c9"],
  person: ["#e7e9f3", "#c3c8e0"],
  abstract: ["#fbdcd5", "#f4a594"],
};

function Motif({ motif }: { motif: Motif }) {
  const stroke = "rgba(40,38,30,0.34)";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (motif) {
    case "phone":
      return (
        <svg viewBox="0 0 120 120" className="imgph__motif">
          <rect x="44" y="26" width="40" height="68" rx="9" {...common} />
          <circle cx="64" cy="60" r="11" {...common} />
        </svg>
      );
    case "door":
      return (
        <svg viewBox="0 0 120 120" className="imgph__motif">
          <rect x="40" y="22" width="40" height="74" rx="3" {...common} />
          <circle cx="71" cy="60" r="2.6" {...common} />
          <rect x="50" y="86" width="22" height="14" rx="2" {...common} />
        </svg>
      );
    case "package":
      return (
        <svg viewBox="0 0 120 120" className="imgph__motif">
          <path d="M30 48l30-14 30 14v30L60 92 30 78Z" {...common} />
          <path d="M30 48l30 14 30-14M60 62v30" {...common} />
        </svg>
      );
    case "desk":
      return (
        <svg viewBox="0 0 120 120" className="imgph__motif">
          <rect x="38" y="40" width="44" height="28" rx="3" {...common} />
          <path d="M34 80h52M52 68v12M68 68v12" {...common} />
          <circle cx="60" cy="32" r="7" {...common} />
        </svg>
      );
    case "portrait":
    case "person":
      return (
        <svg viewBox="0 0 120 120" className="imgph__motif">
          <circle cx="60" cy="46" r="16" {...common} />
          <path d="M30 96c2-18 14-26 30-26s28 8 30 26" {...common} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120" className="imgph__motif">
          <circle cx="60" cy="60" r="26" {...common} />
          <path d="M44 70c8-6 24-6 32 0" {...common} />
        </svg>
      );
  }
}

export default function ImagePlaceholder({
  motif = "abstract",
  ratio = "4 / 3",
  radius = "var(--radius-lg)",
  className,
  label,
}: ImagePlaceholderProps) {
  const [a, b] = TONES[motif];
  return (
    <div
      className={`imgph ${className ?? ""}`}
      style={{
        aspectRatio: ratio,
        borderRadius: radius,
        background: `radial-gradient(120% 120% at 30% 20%, ${a}, ${b})`,
      }}
      role="img"
      aria-label={label ?? "Decorative placeholder image"}
    >
      <span className="imgph__grain" aria-hidden="true" />
      <Motif motif={motif} />
      {label && <span className="imgph__label">{label}</span>}
    </div>
  );
}

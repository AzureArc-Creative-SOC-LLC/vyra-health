interface AvatarProps {
  /** initials, e.g. "HP" */
  initials: string;
  accent?: string;
  size?: number;
  className?: string;
}

/** Initials avatar — placeholder for member/clinician photos. */
export default function Avatar({
  initials,
  accent = "#181d4e",
  size = 48,
  className,
}: AvatarProps) {
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(140deg, ${accent}, ${accent}cc)`,
        color: "#ffffff",
        fontWeight: 600,
        fontFamily: "var(--font-display)",
        fontSize: size * 0.36,
        letterSpacing: "0.02em",
        flexShrink: 0,
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

interface LogoProps {
  /** font-size in px of the primary wordmark */
  size?: number;
  /** render light version for dark backgrounds */
  light?: boolean;
  /** hide the "HEALTH" trailer — useful when space is tight */
  compact?: boolean;
}

/** Vyra Health wordmark — bold uppercase "VYRA" divided by a coral
 *  spark from a spaced-out "HEALTH" trailer. */
export default function Logo({
  size = 26,
  light = false,
  compact = false,
}: LogoProps) {
  const main = light ? "var(--cream-50)" : "var(--ink-900)";
  const trail = light ? "rgba(255,255,255,0.7)" : "var(--ink-500)";
  const spark = "var(--primary)";

  return (
    <span
      aria-label="Vyra Health"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.32,
        fontFamily: "var(--font-display)",
        userSelect: "none",
        lineHeight: 1,
      }}
    >
      <span
        style={{
          fontSize: size,
          fontWeight: 800,
          letterSpacing: "0.14em",
          color: main,
        }}
      >
        VYRA
      </span>

      <span
        aria-hidden="true"
        style={{
          width: size * 0.38,
          height: size * 0.38,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            background: spark,
            transform: "rotate(45deg)",
            clipPath:
              "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
          }}
        />
      </span>

      {!compact && (
        <span
          style={{
            fontSize: size * 0.44,
            fontWeight: 600,
            letterSpacing: "0.32em",
            color: trail,
            paddingTop: 2,
          }}
        >
          HEALTH
        </span>
      )}
    </span>
  );
}

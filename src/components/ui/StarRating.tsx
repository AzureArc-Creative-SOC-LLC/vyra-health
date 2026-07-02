import { IconStar } from "../art/Icons";

interface StarRatingProps {
  /** 0–5, supports halves visually by rounding */
  value: number;
  size?: number;
  /** show numeric value next to stars */
  showValue?: boolean;
}

/** Five-star rating display. */
export default function StarRating({
  value,
  size = 16,
  showValue = false,
}: StarRatingProps) {
  const rounded = Math.round(value);
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
      aria-label={`${value} out of 5 stars`}
    >
      <span style={{ display: "inline-flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <IconStar
            key={n}
            size={size}
            className={n <= rounded ? "star-on" : "star-off"}
          />
        ))}
      </span>
      {showValue && (
        <strong style={{ fontSize: size * 0.92 }}>{value.toFixed(1)}</strong>
      )}
    </span>
  );
}

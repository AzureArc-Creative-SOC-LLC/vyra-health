import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost" | "light" | "dark";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  /** render a trailing circular arrow badge (Vyra Health style) */
  arrow?: boolean;
}

interface LinkButtonProps extends BaseProps {
  to: string;
}

interface ActionButtonProps extends BaseProps {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const classes = (
  variant: Variant,
  size: Size,
  fullWidth?: boolean,
  arrow?: boolean,
  extra?: string
) =>
  [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    arrow ? "btn--arrow" : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");

function ArrowBadge() {
  return (
    <span className="btn__arrow" aria-hidden="true">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12h13M12 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function LinkButton({
  to,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  arrow,
  children,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={classes(variant, size, fullWidth, arrow, className)}
    >
      <span className="btn__label">{children}</span>
      {arrow && <ArrowBadge />}
    </Link>
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  arrow,
  children,
  onClick,
  type = "button",
  disabled,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes(variant, size, fullWidth, arrow, className)}
    >
      <span className="btn__label">{children}</span>
      {arrow && <ArrowBadge />}
    </button>
  );
}

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** stagger index — multiplies the delay */
  index?: number;
  /** base delay in seconds */
  delay?: number;
  /** travel direction */
  from?: "up" | "down" | "left" | "right";
  className?: string;
  /** render as a different element */
  as?: "div" | "li" | "span" | "section";
}

const offsets = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
};

/** Scroll-reveal wrapper — fades + slides children into view once. */
export default function Reveal({
  children,
  index = 0,
  delay = 0,
  from = "up",
  className,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offsets[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: delay + index * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
